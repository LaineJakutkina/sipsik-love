import { computed } from "vue";
import { t, tn } from "@/domain/i18n";
import { useSessionStore } from "@/stores/session";

/**
 * What the cat says over its head and the streak: `n` goes on the badge in the
 * cat card, `note` (if any) is the line under the name pill.
 */
export function useCatSpeech() {
  const session = useSessionStore();

  const say = computed(() => (session.tired ? t("us.speech.tired") : null));

  const streak = computed(() => {
    const s = session.app;
    if (!s.partner && !session.solo) return null;
    const n = s.streak?.n ?? 0;
    const waiting = !!s.partner && !s.streak?.partner_today;
    const withWait = (text: string) =>
      waiting ? t("us.streak.withWait", { text, name: session.partnerName }) : text;
    if (!n) {
      const text = withWait(t(session.solo ? "us.streak.startSolo" : "us.streak.startCouple"));
      return { n: null, text, note: text };
    }
    return {
      n,
      text: withWait(tn(session.solo ? "us.streak.daysSolo" : "us.streak.daysCouple", n)),
      note: waiting ? t("us.streak.waitToday", { name: session.partnerName }) : null,
    };
  });

  return { say, streak };
}
