import { toast } from "vue-sonner";
import { telegram, type HapticKind } from "./telegram";

/** Short status message in the toast pill (one at a time) */
export function notify(message: string, haptic?: HapticKind) {
  toast.dismiss();
  toast(message);
  if (haptic) telegram.haptic(haptic);
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    notify("Скопировано");
  } catch {
    notify("Выдели ссылку и скопируй");
  }
}
