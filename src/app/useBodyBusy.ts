import { watchEffect } from "vue";
import { useSessionStore } from "@/stores/session";

/** Mirror the blocking-request flag on <body> so CSS can freeze buttons meanwhile */
export function useBodyBusy() {
  const session = useSessionStore();
  watchEffect(() => {
    document.body.dataset.busy = String(session.busy);
  });
}
