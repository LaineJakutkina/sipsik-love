import { copyText } from "@/services/notify";
import { telegram } from "@/services/telegram";
import { useSessionStore } from "@/stores/session";

const INVITE_TEXT =
  "Присоединяйся ко мне в Сипсик Love: у нас будет общий котик, вишлист и календарь";

/** Sharing the couple's invite link (settings sheet and the invite card) */
export function useInvite() {
  const session = useSessionStore();

  function shareInvite() {
    const link = session.app.couple.invite_link;
    if (!link) return;
    const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(INVITE_TEXT)}`;
    if (!telegram.openTelegramLink(url)) void copyText(link);
  }

  function copyInvite() {
    void copyText(session.app.couple.invite_link ?? "");
  }

  return { shareInvite, copyInvite };
}
