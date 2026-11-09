import { telegram } from "@/services/telegram";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import type { Id } from "@/domain/types";

/** Support signals and careful talks: the actions behind the banners, cards and sheets */
export function useCareActions() {
  const session = useSessionStore();
  const sheets = useSheetsStore();

  async function sendSos(kind: string, body: string) {
    const msg = `Сигнал отправлен ${session.partnerName} 💜`;
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
      "Ответ отправлен 💜",
    );
  }

  function resolveSos(id: Id) {
    session.mutate(
      "sos.resolve",
      { id },
      (s) => {
        if (s.sos) s.sos.mine = null;
      },
      "Рады, что тебе лучше 🌤",
    );
  }

  function sendTalk(body: string) {
    sheets.close();
    telegram.haptic("success");
    void session.act("talk.send", { body }, "Сообщение отправлено бережно 🕊");
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
      "Ответ отправлен 🕊",
    );
  }

  function closeTalk(id: Id) {
    session.mutate(
      "talk.close",
      { id },
      (s) => {
        if (s.talk) s.talk.mine = null;
      },
      "Рады, что вы поговорили 💜",
    );
  }

  return { sendSos, replySos, resolveSos, sendTalk, replyTalk, closeTalk };
}
