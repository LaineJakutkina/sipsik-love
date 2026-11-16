import source from "@/__localization__/source_lang.json";
import { tAny } from "@/domain/i18n";

/**
 * Texts the server sends in Russian (daily tasks, questions of the day, support asks,
 * tips and quick replies) are listed in `source_lang.json` under `server.*` (and
 * `domain.care.sos.*` for the asks). Here they are looked up by their Russian wording
 * and shown in the current language; a text we don't know is shown as the server sent it.
 */
const byText = new Map<string, string>();

function collect(node: unknown, path: string) {
  if (typeof node === "string") {
    if (!byText.has(node)) byText.set(node, path);
    return;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) collect(v, `${path}.${k}`);
  }
}
collect(source.server, "server");
collect(source.domain.care.sos, "domain.care.sos");

export function serverText(text: string): string {
  const key = byText.get(text.trim());
  return key ? tAny(key) : text;
}
