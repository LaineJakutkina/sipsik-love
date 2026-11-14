import type { WebApp } from "telegram-web-app";

/** Just enough of `Telegram.WebApp` for the app to boot; SDK calls become no-ops */
export function installMockTelegram() {
  const noop = () => {};
  const webApp = {
    initData: "playground",
    ready: noop,
    expand: noop,
    setHeaderColor: noop,
    setBackgroundColor: noop,
    setBottomBarColor: noop,
    disableVerticalSwipes: noop,
    requestWriteAccess: noop,
    HapticFeedback: { impactOccurred: noop, notificationOccurred: noop },
    openLink: (url: string) => window.open(url, "_blank", "noopener"),
    openTelegramLink: (url: string) => window.open(url, "_blank", "noopener"),
    openInvoice: (_link: string, cb?: (status: string) => void) => cb?.("cancelled"),
  } as unknown as WebApp;
  window.Telegram = { WebApp: webApp } as typeof window.Telegram;
}
