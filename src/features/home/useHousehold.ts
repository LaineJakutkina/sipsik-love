import { tmpId, isTmp } from "@/domain/ids";
import { today } from "@/domain/dates";
import { t } from "@/domain/i18n";
import type { Id, Who } from "@/domain/types";
import { notify } from "@/services/notify";
import { telegram } from "@/services/telegram";
import { useSessionStore } from "@/stores/session";

/** Optimistic records can't be edited until the server confirms them */
function busyTmp(id: Id) {
  if (!isTmp(id)) return false;
  notify(t("common.savingWait"));
  return true;
}

/** Shopping list and chores actions (same payloads and messages as before) */
export function useHousehold() {
  const session = useSessionStore();

  /** `quiet`: no “Добавлено” toast (the quick sheet shows the list itself) */
  function addShop(title: string, quiet = false) {
    if (!title) return;
    const lower = title.toLowerCase();
    if (session.app.shop.some((x) => x.title.toLowerCase() === lower && !x.done)) {
      notify(t("home.toast.alreadyInList"));
      return;
    }
    session.mutate(
      "shop.add",
      { title },
      (s) => s.shop.unshift({ id: tmpId(), title, done: false }),
      quiet ? undefined : t("home.toast.added", { title }),
    );
    telegram.haptic("light");
  }

  function toggleShop(id: Id) {
    if (busyTmp(id)) return;
    session.mutate("shop.toggle", { id }, (s) => {
      const x = s.shop.find((i) => i.id === id);
      if (x) x.done = !x.done;
    });
  }

  function removeShop(id: Id) {
    if (busyTmp(id)) return;
    session.mutate("shop.delete", { id }, (s) => {
      s.shop = s.shop.filter((x) => x.id !== id);
    });
  }

  function clearBought() {
    session.mutate("shop.clear", {}, (s) => {
      s.shop = s.shop.filter((x) => !x.done);
    });
  }

  /** @returns false when the title is missing */
  function addChore(title: string, who: Who, freq: string): boolean {
    if (!title) {
      notify(t("home.toast.needChoreTitle"));
      return false;
    }
    session.mutate(
      "chore.add",
      { title, who, freq },
      (s) => s.chores.push({ id: tmpId(), title, who, freq, done_on: null }),
      t("home.toast.choreAdded"),
    );
    return true;
  }

  function toggleChore(id: Id) {
    if (busyTmp(id)) return;
    session.mutate("chore.toggle", { id }, (s) => {
      const c = s.chores.find((x) => x.id === id);
      if (c) c.done_on = c.done_on === today() ? null : today();
    });
  }

  function swapChore(id: Id) {
    if (busyTmp(id)) return;
    session.mutate("chore.swap", { id }, (s) => {
      const c = s.chores.find((x) => x.id === id);
      if (c) c.who = c.who === "me" ? "partner" : "me";
    });
  }

  function removeChore(id: Id) {
    if (busyTmp(id)) return;
    session.mutate("chore.delete", { id }, (s) => {
      s.chores = s.chores.filter((c) => c.id !== id);
    });
  }

  return {
    addShop,
    toggleShop,
    removeShop,
    clearBought,
    addChore,
    toggleChore,
    swapChore,
    removeChore,
  };
}
