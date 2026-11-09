import type { Gender, MoodId } from "@/domain/moods";
import type { AppState, DateStr, Id, SpaceMode, TapResult, Who } from "@/domain/types";

type IdPayload = { id: Id };
type Empty = Record<string, never>;
interface PhotoPayload {
  photo?: string;
  thumb?: string;
}

/**
 * Every backend action: its payload and response. Most actions answer with the
 * whole fresh state.
 */
export interface ApiContract {
  me: { payload: { code: string }; response: AppState };
  state: { payload: Empty; response: AppState };
  ping: { payload: Empty; response: { rev?: number } };
  tap: { payload: { n: number }; response: TapResult };
  buy: { payload: { coat: string }; response: { link: string } };
  "nvc.rewrite": { payload: { text: string }; response: { text: string } };

  "couple.create": {
    payload: {
      solo?: boolean;
      mode?: SpaceMode;
      start_date?: DateStr;
      pet_name: string;
      my_name: string;
      gender?: Gender;
    };
    response: AppState;
  };
  "couple.join": { payload: { code: string }; response: AppState };
  "couple.leave": { payload: Empty; response: AppState };
  "couple.update": {
    payload: {
      my_name?: string;
      pet_name?: string;
      start_date?: DateStr;
      notify?: boolean;
      gender?: Gender | null;
      mode?: SpaceMode;
    };
    response: AppState;
  };

  mood: { payload: { mood: MoodId }; response: AppState };
  wear: { payload: { item: string; on: boolean }; response: AppState };
  "coat.set": { payload: { coat: string }; response: AppState };
  "task.done": { payload: { idx: number }; response: AppState };
  answer: { payload: { body: string }; response: AppState };

  "note.send": { payload: { body: string }; response: AppState };
  "note.delete": { payload: IdPayload; response: AppState };

  "sos.send": { payload: { kind: string; body: string }; response: AppState };
  "sos.reply": { payload: { id: Id; reply: string }; response: AppState };
  "sos.resolve": { payload: IdPayload; response: AppState };
  "talk.send": { payload: { body: string }; response: AppState };
  "talk.reply": { payload: { id: Id; reply: string }; response: AppState };
  "talk.close": { payload: IdPayload; response: AppState };

  "thanks.add": { payload: { body: string }; response: AppState };
  "thanks.delete": { payload: IdPayload; response: AppState };
  "thanks.heart": { payload: IdPayload; response: AppState };
  "memory.add": { payload: { body: string; day: DateStr } & PhotoPayload; response: AppState };
  "memory.delete": { payload: IdPayload; response: AppState };

  "wish.add": {
    payload: {
      owner: Who;
      title: string;
      price: string | null;
      link: string | null;
      note: string | null;
    } & PhotoPayload;
    response: AppState;
  };
  "wish.delete": { payload: IdPayload; response: AppState };
  "wish.done": { payload: IdPayload; response: AppState };
  "wish.reserve": { payload: IdPayload; response: AppState };
  "wish.photo": { payload: IdPayload & Required<PhotoPayload>; response: AppState };

  "shop.add": { payload: { title: string }; response: AppState };
  "shop.toggle": { payload: IdPayload; response: AppState };
  "shop.delete": { payload: IdPayload; response: AppState };
  "shop.clear": { payload: Empty; response: AppState };

  "chore.add": {
    payload: { title: string; who: Who; freq: string | null };
    response: AppState;
  };
  "chore.toggle": { payload: IdPayload; response: AppState };
  "chore.swap": { payload: IdPayload; response: AppState };
  "chore.delete": { payload: IdPayload; response: AppState };
  "chore.split": { payload: Empty; response: AppState };

  "plan.add": {
    payload: { day: DateStr; time?: string | null; title: string };
    response: AppState;
  };
  "plan.delete": { payload: IdPayload; response: AppState };
  "bday.add": { payload: { name: string; bdate: DateStr }; response: AppState };
  "bday.delete": { payload: IdPayload; response: AppState };
  "date.add": { payload: { title: string; day: DateStr; yearly: boolean }; response: AppState };
  "date.delete": { payload: IdPayload; response: AppState };
  "place.add": { payload: { title: string }; response: AppState };
  "place.delete": { payload: IdPayload; response: AppState };
}

export type Action = keyof ApiContract;
export type PayloadOf<A extends Action> = ApiContract[A]["payload"];
export type ResponseOf<A extends Action> = ApiContract[A]["response"];
/** Actions whose response is the full state (usable with `mutate`/`act`) */
export type StateAction = {
  [A in Action]: ResponseOf<A> extends AppState ? A : never;
}[Action];
