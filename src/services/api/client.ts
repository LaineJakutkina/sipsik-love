import { today } from "@/domain/dates";
import { config } from "@/shared/config";
import { telegram } from "../telegram";
import type { Action, PayloadOf, ResponseOf } from "./contract";

export class ApiError extends Error {}

interface CallOptions {
  /** Let the request finish even if the page is being hidden/closed */
  keepalive?: boolean;
}

/** Call a backend action. Every request carries the Telegram init data and today's local date. */
export async function call<A extends Action>(
  action: A,
  ...[payload, opts]: {} extends PayloadOf<A>
    ? [payload?: PayloadOf<A>, opts?: CallOptions]
    : [payload: PayloadOf<A>, opts?: CallOptions]
): Promise<ResponseOf<A>> {
  const res = await fetch(config.apiUrl, {
    method: "POST",
    keepalive: !!opts?.keepalive,
    headers: { "content-type": "application/json", "x-init-data": telegram.initData },
    body: JSON.stringify({ action, day: today(), ...payload }),
  });
  let data: (ResponseOf<A> & { error?: string }) | null = null;
  try {
    data = await res.json();
  } catch {
    // handled below
  }
  if (!data) throw new ApiError("Сервер не ответил. Проверь интернет и попробуй ещё раз");
  if (!res.ok || data.error) throw new ApiError(data.error || "Ошибка сервера");
  return data;
}

export const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "Что-то пошло не так";
