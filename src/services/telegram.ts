import type { WebApp } from "telegram-web-app";
/** Thin, failure-tolerant wrapper over the Telegram Mini App SDK */

const BRAND_NAVY = "#1f1d38";
const BRAND_PAPER = "#ffffff";

type Impact = "light" | "medium" | "heavy";
type Notice = "error" | "success";
export type HapticKind = Impact | Notice;

const webApp = (): WebApp | undefined => window.Telegram?.WebApp;

/** Run an SDK call that may be missing on old clients or throw outside Telegram */
function safely(fn: (tg: WebApp) => void) {
  const tg = webApp();
  if (!tg) return;
  try {
    fn(tg);
  } catch {
    // Not critical: old client or not inside Telegram
  }
}

export const telegram = {
  get initData() {
    return webApp()?.initData ?? "";
  },
  get available() {
    return !!webApp()?.initData;
  },
  get canPay() {
    return typeof webApp()?.openInvoice === "function";
  },

  /** Signal readiness, go fullscreen and paint the chrome in brand colours */
  setup() {
    safely((tg) => {
      tg.ready();
      tg.expand();
      tg.setHeaderColor?.(BRAND_NAVY);
      tg.setBackgroundColor?.(BRAND_PAPER);
      tg.setBottomBarColor?.(BRAND_PAPER as `#${string}`);
      tg.disableVerticalSwipes?.();
    });
  },

  haptic(kind: HapticKind = "light") {
    safely((tg) => {
      if (kind === "error" || kind === "success") tg.HapticFeedback.notificationOccurred(kind);
      else tg.HapticFeedback.impactOccurred(kind);
    });
  },

  /** Ask for permission to send messages (notes, reminders) */
  requestWriteAccess() {
    safely((tg) => tg.requestWriteAccess?.());
  },

  openLink(url: string) {
    const tg = webApp();
    try {
      if (!tg) throw new Error("no telegram");
      tg.openLink(url);
    } catch {
      window.open(url, "_blank", "noopener");
    }
  },

  /** @returns false when the link couldn't be opened inside Telegram */
  openTelegramLink(url: string): boolean {
    const tg = webApp();
    if (!tg) return false;
    try {
      tg.openTelegramLink(url);
      return true;
    } catch {
      return false;
    }
  },

  /** Open a Telegram Stars invoice; resolves with its final status */
  openInvoice(link: string): Promise<string> {
    return new Promise((resolve) => {
      const tg = webApp();
      if (!tg) return resolve("failed");
      tg.openInvoice(link, (status) => resolve(status));
    });
  },
};
