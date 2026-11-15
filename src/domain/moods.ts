import { t, tg } from "./i18n";

export const MOOD_IDS = ["tears", "tired", "angry", "neutral", "happy"] as const;
export type MoodId = (typeof MOOD_IDS)[number];

export interface Mood {
  id: MoodId;
  name: string;
}

export const MOODS: readonly Mood[] = MOOD_IDS.map((id) => ({
  id,
  get name() {
    return t(`domain.moods.names.${id}`);
  },
}));

export type Gender = "m" | "f";

export const GENDER_OPTIONS: readonly { value: Gender; label: string }[] = [
  {
    value: "f",
    get label() {
      return t("domain.moods.gender.she");
    },
  },
  {
    value: "m",
    get label() {
      return t("domain.moods.gender.he");
    },
  },
];

/** Partner mood phrased for the partner's gender: «Аня сегодня: счастлива» */
export function moodLabel(id: MoodId | null | undefined, gender?: Gender | null): string {
  switch (id) {
    case "tears":
      return t("domain.moods.partner.tears");
    case "tired":
      return tg("domain.moods.partner.tired", gender);
    case "angry":
      return t("domain.moods.partner.angry");
    case "neutral":
      return t("domain.moods.partner.neutral");
    case "happy":
      return tg("domain.moods.partner.happy", gender);
    default:
      return "—";
  }
}

export const isMood = (v: unknown): v is MoodId => MOOD_IDS.includes(v as MoodId);
