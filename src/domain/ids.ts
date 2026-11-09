/** Temporary ids mark optimistic records the server hasn't confirmed yet */
const TMP = "tmp";

export const tmpId = () => TMP + Date.now() + Math.random().toString(36).slice(2, 6);

export const isTmp = (id: unknown) => String(id).startsWith(TMP);
