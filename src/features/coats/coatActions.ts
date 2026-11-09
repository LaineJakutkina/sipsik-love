import { COAT_META, isCoatId } from "@/domain/coats";
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
              ? `Готово! ${pet} теперь ${COAT_META[id].name.toLowerCase()} 🎉`
              : `Готово! ${pet} в новом окрасе 🎉`,
            "success",
          );
          return;
        }
      } catch {
        // try again
      }
    }
    notify("Оплата прошла. Окрас появится через минуту, обнови экран");
  }

  /** Opens the Stars invoice. Throws when the invoice link couldn't be created. */
  async function buyCoat(id: string) {
    const { link } = await call("buy", { coat: id });
    sheets.close();
    const status = await telegram.openInvoice(link);
    if (status === "paid") {
      const pet = session.petName;
      notify(
        isAnimalCoat(id) ? `Оплата прошла! ${pet} превращается…` : `Оплата прошла! Красим ${pet}…`,
      );
      void waitForCoat(id);
    } else if (status === "failed") notify("Оплата не прошла. Попробуй ещё раз");
  }

  return { chooseCoat, buyCoat };
}
