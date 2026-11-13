export const MOOD_IDS = ["tears", "tired", "angry", "neutral", "happy"] as const;
export type MoodId = (typeof MOOD_IDS)[number];

export interface Mood {
  id: MoodId;
  name: string;
}

export const MOODS: readonly Mood[] = [
  { id: "tears", name: "Слёзы" },
  { id: "tired", name: "Устал" },
  { id: "angry", name: "Злюсь" },
  { id: "neutral", name: "Спокойно" },
  { id: "happy", name: "Счастлив" },
];

export type Gender = "m" | "f";

export const GENDER_OPTIONS: readonly { value: Gender; label: string }[] = [
  { value: "f", label: "Она" },
  { value: "m", label: "Он" },
];

/** Partner mood phrased for the partner's gender: «Аня сегодня: счастлива» */
export function moodLabel(id: MoodId | null | undefined, gender?: Gender | null): string {
  switch (id) {
    case "tears":
      return "грустно";
    case "tired":
      return gender === "f" ? "устала" : gender === "m" ? "устал" : "устал(а)";
    case "angry":
      return "злится";
    case "neutral":
      return "спокойно";
    case "happy":
      return gender === "f" ? "счастлива" : gender === "m" ? "счастлив" : "счастлив(а)";
    default:
      return "—";
  }
}

export const isMood = (v: unknown): v is MoodId => MOOD_IDS.includes(v as MoodId);
