import { computed } from "vue";
import { isoToDay } from "@/domain/dates";
import { isTmp, tmpId } from "@/domain/ids";
import type { Thanks } from "@/domain/types";
import { notify } from "@/services/notify";
import { telegram } from "@/services/telegram";
import { useSessionStore } from "@/stores/session";
import { useUsUiStore } from "./usUi";

export interface ThanksDay {
  day: string;
  items: Thanks[];
}

/** Gratitude feed (couple “спасибо” or the solo journal) and its actions */
export function useThanks() {
  const session = useSessionStore();
  const ui = useUsUiStore();

  const list = computed(() => session.app.thanks ?? []);

  /** Feed split into days, newest first as the server sends it */
  const days = computed(() => {
    const out: ThanksDay[] = [];
    for (const x of list.value) {
      const day = isoToDay(x.created_at);
      const last = out.at(-1);
      if (last?.day === day) last.items.push(x);
      else out.push({ day, items: [x] });
    }
    return out;
  });

  /** @returns false when there was nothing to send */
  function add(text: string): boolean {
    const body = text.trim();
    if (!body) {
      notify("Напиши, за что спасибо");
      return false;
    }
    telegram.haptic("success");
    session.mutate(
      "thanks.add",
      { body },
      (s) => {
        (s.thanks ??= []).unshift({
          id: tmpId(),
          who: "me",
          body,
          hearted: false,
          created_at: new Date().toISOString(),
        });
      },
      session.solo ? "Записано в дневник 💛" : "Спасибо отправлено 💛",
    );
    return true;
  }

  function heart(id: string) {
    if (isTmp(id)) return notify("Секунду, сохраняем…");
    telegram.haptic("light");
    session.mutate("thanks.heart", { id }, (s) => {
      const x = s.thanks?.find((y) => y.id === id);
      if (x) x.hearted = !x.hearted;
    });
  }

  function remove(id: string) {
    if (isTmp(id)) return notify("Секунду, сохраняем…");
    ui.thanksDel = null;
    session.mutate("thanks.delete", { id }, (s) => {
      s.thanks = (s.thanks ?? []).filter((x) => x.id !== id);
    });
  }

  return { list, days, add, heart, remove };
}
