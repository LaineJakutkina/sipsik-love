/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_BOT_USERNAME?: string;
  /** "1" builds the browser demo: no Telegram, no server, data in localStorage */
  readonly VITE_DEMO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Week data from Intl.Locale (Safari ≤ 17 and Chrome ≤ 129 only have the `weekInfo` getter, some engines neither) */
declare namespace Intl {
  interface Locale {
    getWeekInfo?(): { firstDay: number };
    readonly weekInfo?: { firstDay: number };
  }
}
