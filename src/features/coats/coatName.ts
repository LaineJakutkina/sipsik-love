import { COAT_META, isCoatId, type CoatOffer } from "@/domain/coats";

/** The coat name in the user's language; the server's name only for coats we don't know yet */
export const coatName = (c: CoatOffer): string => (isCoatId(c.id) ? COAT_META[c.id].name : c.name);
