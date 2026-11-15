import { t } from "@/domain/i18n";
import { copyText } from "@/services/notify";
import { telegram } from "@/services/telegram";
import { useSessionStore } from "@/stores/session";

/** Sharing the couple's invite link (settings sheet and the invite card) */
export function useInvite() {
  const session = useSessionStore();

  function shareInvite() {
    const link = session.app.couple.invite_link;
    if (!link) return;
    const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(t("settings.invite.shareText"))}`;
    if (!telegram.openTelegramLink(url)) void copyText(link);
  }

  function copyInvite() {
    void copyText(session.app.couple.invite_link ?? "");
  }

  return { shareInvite, copyInvite };
}
