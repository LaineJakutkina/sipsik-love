/**
 * Dev-only playground (`/playground.html`, never part of the production build).
 * - top window: a device frame with a phone-sized iframe
 * - inside the iframe (`?app`): the real app on a mocked Telegram and an in-memory API
 */
import { installMockApi } from "./mockApi";
import { installMockTelegram } from "./mockTelegram";

if (new URLSearchParams(location.search).has("app")) {
  installMockTelegram();
  installMockApi();
  await import("@/main");
} else {
  const [{ createApp }, { default: DevicePreview }] = await Promise.all([
    import("vue"),
    import("./DevicePreview.vue"),
    import("@/assets/main.css"),
  ]);
  createApp(DevicePreview).mount("#app");
}
