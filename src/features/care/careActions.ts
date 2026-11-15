import { t } from "@/domain/i18n";
import { telegram } from "@/services/telegram";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import type { Id } from "@/domain/types";

/** Support signals and careful talks: the actions behind the banners, cards and sheets */
export function useCareActions() {
  const session = useSessionStore();
  const sheets = useSheetsStore();

  async function sendSos(kind: string, body: string) {
    const msg = t("care.actions.sosSent", { name: session.partnerName });
    sheets.close();
    telegram.haptic("success");
    if (await session.act("sos.send", { kind, body }, msg)) sheets.open("breath");
  }

  function replySos(reply: string) {
    const p = session.app.sos?.partner;
    if (!p) return;
    telegram.haptic("success");
    session.mutate(
      "sos.reply",
      { id: p.id, reply },
      (s) => {
        if (s.sos?.partner) s.sos.partner.reply = reply;
      },
      t("care.actions.sosReplied"),
    );
  }

  function resolveSos(id: Id) {
    session.mutate(
      "sos.resolve",
      { id },
      (s) => {
        if (s.sos) s.sos.mine = null;
      },
      t("care.actions.sosResolved"),
    );
  }

  function sendTalk(body: string) {
    sheets.close();
    telegram.haptic("success");
    void session.act("talk.send", { body }, t("care.actions.talkSent"));
  }

  function replyTalk(reply: string) {
    const p = session.app.talk?.partner;
    if (!p) return;
    session.mutate(
      "talk.reply",
      { id: p.id, reply },
      (s) => {
        if (s.talk?.partner) s.talk.partner.reply = reply;
      },
      t("care.actions.talkReplied"),
    );
  }

  function closeTalk(id: Id) {
    session.mutate(
      "talk.close",
      { id },
      (s) => {
        if (s.talk) s.talk.mine = null;
      },
      t("care.actions.talkClosed"),
    );
  }

  return { sendSos, replySos, resolveSos, sendTalk, replyTalk, closeTalk };
}
