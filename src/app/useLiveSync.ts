import { useDocumentVisibility, useIntervalFn } from "@vueuse/core";
import { watch } from "vue";
import { useSessionStore } from "@/stores/session";
import { useTapsStore } from "@/stores/taps";

const PING_MS = 15_000;

/**
 * Keeps the screen in sync with the partner: pings every 15 s while visible,
 * flushes taps when the app goes to background and refreshes when it comes back.
 */
export function useLiveSync() {
  const session = useSessionStore();
  const taps = useTapsStore();
  const visibility = useDocumentVisibility();

  useIntervalFn(() => void session.ping(), PING_MS);

  watch(visibility, (v) => {
    if (v === "hidden") void taps.flush(true);
    else void session.refresh();
  });
}
