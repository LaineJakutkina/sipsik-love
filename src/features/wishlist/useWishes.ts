import { computed } from "vue";
import { t } from "@/domain/i18n";
import { isTmp, tmpId } from "@/domain/ids";
import type { Id, Photo, Who, Wish } from "@/domain/types";
import { notify } from "@/services/notify";
import { readPhoto } from "@/services/photo";
import { useSessionStore } from "@/stores/session";
import { useWishUiStore } from "./wishUi";

export interface WishDraft {
  title: string;
  price: string;
  link: string;
  note: string;
}

/** Optimistic records can't be edited until the server confirms them */
function busyTmp(id: Id) {
  if (!isTmp(id)) return false;
  notify(t("common.savingWait"));
  return true;
}

const byId = (wishes: Wish[], id: Id) => wishes.find((w) => w.id === id);

/** Wishlist data and every action on it (same payloads and messages as before) */
export function useWishes() {
  const session = useSessionStore();
  const wishUi = useWishUiStore();

  const photoLimit = computed(() => session.limits.wish_photos);
  const photoCount = (owner: Who) =>
    session.app.wishes.filter((w) => w.owner === owner && w.photo_url).length;
  const photosFull = (owner: Who) => photoCount(owner) >= photoLimit.value;

  /** @returns false when the title is missing and the form should stay as is */
  async function add(draft: WishDraft): Promise<boolean> {
    const title = draft.title.trim();
    if (!title) {
      notify(t("wishlist.toast.needTitle"));
      return false;
    }
    const owner = wishUi.who;
    const photo = wishUi.draftPhoto;
    const payload = {
      owner,
      title,
      price: draft.price.trim(),
      link: draft.link.trim(),
      note: draft.note.trim(),
    };
    wishUi.closeForm();
    if (photo) {
      notify(t("wishlist.toast.savingWithPhoto"));
      const ok = await session.act(
        "wish.add",
        { ...payload, photo: photo.full, thumb: photo.thumb },
        t("wishlist.toast.added"),
      );
      if (!ok) {
        wishUi.formOpen = true;
        wishUi.draftPhoto = photo;
      }
    } else {
      session.mutate(
        "wish.add",
        payload,
        (s) =>
          s.wishes.unshift({
            id: tmpId(),
            ...payload,
            photo_url: null,
            thumb_url: null,
            done: false,
            reserved_by_me: false,
          }),
        t("wishlist.toast.added"),
      );
    }
    return true;
  }

  function toggleReserve(id: Id) {
    if (busyTmp(id)) return;
    const w = byId(session.app.wishes, id);
    session.mutate(
      "wish.reserve",
      { id },
      (s) => {
        const x = byId(s.wishes, id);
        if (x) x.reserved_by_me = !x.reserved_by_me;
      },
      w?.reserved_by_me ? t("wishlist.toast.unreserved") : t("wishlist.toast.reserved"),
    );
  }

  function markDone(id: Id) {
    if (busyTmp(id)) return;
    session.mutate(
      "wish.done",
      { id },
      (s) => {
        const x = byId(s.wishes, id);
        if (x) x.done = true;
      },
      t("wishlist.toast.done"),
    );
  }

  /** @returns false when the wish isn't saved yet */
  function remove(id: Id): boolean {
    if (busyTmp(id)) return false;
    session.mutate(
      "wish.delete",
      { id },
      (s) => {
        s.wishes = s.wishes.filter((w) => w.id !== id);
      },
      t("wishlist.toast.removed"),
    );
    return true;
  }

  async function readFile(file: File): Promise<Photo | null> {
    try {
      return await readPhoto(file);
    } catch {
      notify(t("wishlist.toast.photoUnreadable"));
      return null;
    }
  }

  async function uploadPhoto(id: Id, file: File) {
    const photo = await readFile(file);
    if (!photo || busyTmp(id)) return;
    notify(t("wishlist.toast.photoUploading"));
    await session.act(
      "wish.photo",
      { id, photo: photo.full, thumb: photo.thumb },
      t("wishlist.toast.photoAdded"),
    );
  }

  return { photoLimit, photoCount, photosFull, add, toggleReserve, markDone, remove, uploadPhoto };
}
