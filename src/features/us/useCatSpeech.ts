import { computed } from "vue";
import { DAY_FORMS, plural } from "@/shared/lib/plural";
import { useSessionStore } from "@/stores/session";

/** What the cat says over its head and the streak line under the name pill */
export function useCatSpeech() {
  const session = useSessionStore();

  const say = computed(() => (session.tired ? "Я устал, подождите до завтра 😴" : null));

  const streak = computed(() => {
    const s = session.app;
    if (!s.partner && !session.solo) return null;
    const n = s.streak?.n ?? 0;
    const wait = s.partner && !s.streak?.partner_today ? ` · ждём ${session.partnerName}` : "";
    if (!n) {
      const text = session.solo
        ? "Заходи каждый день, и начнётся серия"
        : "Заходите оба каждый день, и начнётся серия";
      return { n: null, text: text + wait };
    }
    const tail = session.solo ? "подряд ты с котиком" : "подряд вместе";
    return { n, text: `${plural(n, DAY_FORMS)} ${tail}${wait}` };
  });

  return { say, streak };
}
