import { defineStore } from "pinia";
import { shallowRef } from "vue";

/** Bottom sheets / overlays and the props each one needs */
export interface SheetProps {
  settings: undefined;
  note: undefined;
  shop: undefined;
  sos: undefined;
  breath: undefined;
  talk: undefined;
  coat: { id: string };
  photo: { url: string };
}
export type SheetKind = keyof SheetProps;

export type OpenSheet = {
  [K in SheetKind]: { kind: K; props: SheetProps[K] };
}[SheetKind];

/** Only one sheet is open at a time; opening another replaces it */
export const useSheetsStore = defineStore("sheets", () => {
  const current = shallowRef<OpenSheet | null>(null);

  function open<K extends SheetKind>(
    kind: K,
    ...[props]: SheetProps[K] extends undefined ? [] : [SheetProps[K]]
  ) {
    current.value = { kind, props } as OpenSheet;
  }

  function close() {
    current.value = null;
  }

  return { current, open, close };
});
