import { COAT_META, isCoatId } from "@/domain/coats";
import { formatLocale, t } from "@/domain/i18n";
import { call } from "@/services/api/client";
import { notify } from "@/services/notify";
import { telegram } from "@/services/telegram";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";

const isAnimalCoat = (id: string) => isCoatId(id) && COAT_META[id].animal;

/** Choosing an owned coat, or opening the purchase sheet for a new one */
export function useCoatActions() {
  const session = useSessionStore();
  const sheets = useSheetsStore();

  function chooseCoat(id: string) {
    const c = session.app.coats?.find((x) => x.id === id);
    if (!c) return;
    const has = (session.app.couple.owned ?? []).includes(id) || !c.price;
    if (!has) {
      sheets.open("coat", { id });
      return;
    }
    if (session.app.couple.coat === id) return;
    telegram.haptic("medium");
    session.mutate("coat.set", { coat: id }, (s) => {
      s.couple.coat = id;
    });
  }

  /** After payment the bot grants the coat asynchronously: poll until it shows up */
  async function waitForCoat(id: string) {
    for (let i = 0; i < 12; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      try {
        const st = await call("state");
        if ((st.couple?.owned ?? []).includes(id)) {
          session.state = st;
          const pet = session.petName;
          notify(
            isAnimalCoat(id) && isCoatId(id)
              ? t("coats.actions.readyAnimal", {
                  pet,
                  name: COAT_META[id].name.toLocaleLowerCase(formatLocale()),
                })
              : t("coats.actions.readyCoat", { pet }),
            "success",
          );
          return;
        }
      } catch {
        // try again
      }
    }
    notify(t("coats.actions.paidLater"));
  }

  /** Opens the Stars invoice. Throws when the invoice link couldn't be created. */
  async function buyCoat(id: string) {
    const { link } = await call("buy", { coat: id });
    sheets.close();
    const status = await telegram.openInvoice(link);
    if (status === "paid") {
      const pet = session.petName;
      notify(
        isAnimalCoat(id)
          ? t("coats.actions.paidAnimal", { pet })
          : t("coats.actions.paidCoat", { pet }),
      );
      void waitForCoat(id);
    } else if (status === "failed") notify(t("coats.actions.payFailed"));
  }

  return { chooseCoat, buyCoat };
}
