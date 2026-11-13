import { coatOrDefault, type CoatId } from "@/domain/coats";
import { ITEM_BY_ID, wornIn, type ItemId, type Worn } from "@/domain/items";
import type { MoodId } from "@/domain/moods";
import { ellipse, group, path, translate, type GroupShape } from "../art/shapes";
import { catBodyArt, feetArt, pawPaint } from "./body";
import { faceArt, lidsArt, noseArt, whiskersArt } from "./face";
import { FUR, GROUND, silhouetteOf } from "./geometry";
import { CLOTHES, HOLD, ITEM_ART, ITEM_VIEWBOX, PUFFER } from "./items";
import { PALETTES } from "./palettes";

/** Labels of nodes the scene animates */
export const PART = {
  breath: "breath",
  body: "catbody",
  lidL: "lid-l",
  lidR: "lid-r",
} as const;

export interface CharacterLook {
  mood: MoodId;
  coat?: CoatId | string;
  worn: Worn;
  /** Items above this many taps are hidden even if marked worn */
  clicks?: number;
}

/** The cat is drawn a bit smaller than its design size so the ride behind it shows */
const CAT_SCALE = 0.84;

/** Transform that lets a group scale around the ground point */
const aroundGround = () => ({
  x: GROUND[0],
  y: GROUND[1],
  pivotX: GROUND[0],
  pivotY: GROUND[1],
});

function clothesArt(id: ItemId, clipShape: string) {
  if (id === "puffer") return PUFFER;
  const parts = CLOTHES[id];
  return parts ? group(parts(), { clip: clipShape }) : null;
}

/** A small copy of the cat (the «kitten» pet item) in the given coat */
export function kittenArt(coatId: CoatId) {
  const p = PALETTES[coatId];
  return group(
    [
      catBodyArt(p, coatId),
      feetArt(p, { fill: p.paws ?? p.fur }),
      faceArt("neutral", p),
      noseArt(p),
    ],
    { transform: translate(26, 168, 0.27) },
  );
}

/** Full character art in the 300×215 design space */
export function composeCharacter({ mood, coat, worn, clicks }: CharacterLook): GroupShape {
  const coatId = coatOrDefault(coat);
  const p = PALETTES[coatId];
  const shape = silhouetteOf(p.smooth);
  const slot = (s: Parameters<typeof wornIn>[1]) => wornIn(worn, s, clicks)[0];
  const has = (id: ItemId) => wornIn(worn, ITEM_BY_ID[id].slot, clicks).includes(id);

  const ride = slot("ride");
  const head = slot("head");
  const body = slot("body");
  const hold = slot("paw");
  const pet = slot("pet");
  const holdAt = hold && HOLD[hold];

  return group([
    (ride === "truck" || ride === "bike") && ITEM_ART[ride]?.(),
    group(
      [
        ellipse(150, 209, 96, 6, { fill: "#1f1d38", alpha: 0.1 }),
        ride === "skate" && ITEM_ART.skate?.(),
        group(
          [
            group(
              [
                catBodyArt(p, coatId),
                body && body !== "puffer" && clothesArt(body, shape),
                feetArt(p),
                body === "puffer" && PUFFER,
                head && ITEM_ART[head]?.(),
                faceArt(mood, p),
                noseArt(p),
                mood !== "tired" && mood !== "happy" && lidsArt(p),
                whiskersArt(p),
                has("glasses") && ITEM_ART.glasses?.(),
                has("chain") && ITEM_ART.chain?.(),
                has("bag") && ITEM_ART.bag?.(),
                has("cig") && ITEM_ART.cig?.(),
                hold && ITEM_ART[hold]?.(),
                holdAt && ellipse(holdAt[0], holdAt[1], 12, 9, pawPaint(p)),
              ],
              { label: PART.body, transform: aroundGround() },
            ),
          ],
          { label: PART.breath, transform: aroundGround() },
        ),
      ],
      { transform: { ...aroundGround(), scaleX: CAT_SCALE, scaleY: CAT_SCALE } },
    ),
    pet === "mouse" && ITEM_ART.mouse?.(),
    pet === "kitten" && kittenArt(coatId),
  ]);
}

/* ---------- thumbnails ---------- */

export interface ArtFrame {
  art: GroupShape;
  /** SVG-like viewBox `x y w h` to crop */
  viewBox: string;
}

/** Head-and-shoulders portrait for mood pickers and the coat list */
export function faceThumb(mood: MoodId, coat: CoatId | string | undefined): ArtFrame {
  const coatId = coatOrDefault(coat);
  const p = PALETTES[coatId];
  return {
    art: group([catBodyArt(p, coatId), faceArt(mood, p), noseArt(p)]),
    viewBox: "90 16 120 120",
  };
}

/** Item icon for the wardrobe grid */
export function itemThumb(id: ItemId, coat: CoatId | string | undefined): ArtFrame {
  const viewBox = ITEM_VIEWBOX[id];
  if (id === "kitten") return { art: group([kittenArt(coatOrDefault(coat))]), viewBox };
  if (id === "puffer" || CLOTHES[id]) {
    return {
      art: group([path(FUR, { fill: "#e9e6f0" }), clothesArt(id, FUR)]),
      viewBox,
    };
  }
  return { art: group([ITEM_ART[id]?.()]), viewBox };
}

/** The whole character, e.g. as a coat preview */
export const characterThumb = (look: CharacterLook): ArtFrame => ({
  art: composeCharacter(look),
  viewBox: "0 0 300 215",
});
