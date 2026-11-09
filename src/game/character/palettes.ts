import type { CoatId } from "@/domain/coats";

export type PatternId =
  | "tabby"
  | "calico"
  | "siamese"
  | "frog"
  | "dog"
  | "fox"
  | "panda"
  | "cow"
  | "penguin"
  | "tuxedo";

/** Special noses; anything else is a colour for the default triangle nose */
export type NoseStyle = "none" | "frog" | "beak" | "big" | (string & {});

/** Colours and features for one coat */
export interface Palette {
  fur: string;
  ear: string;
  earFill?: string;
  strand: string;
  belly: string;
  eye: string;
  /** Eyebrows and closed happy eyes */
  arc: string;
  pupil: string;
  mouth: string;
  nose: NoseStyle;
  /** Empty: no whiskers */
  whisk: string;
  /** Eyelid colour for blinking */
  lid: string;
  pat?: PatternId;
  stripe?: string;
  chest?: string;
  paws?: string;
  outline?: string;
  noBelly?: boolean;
  /** Plain ellipse silhouette instead of fluffy fur */
  smooth?: boolean;
}

export const PALETTES: Record<CoatId, Palette> = {
  black: {
    fur: "#15141f",
    ear: "#2e2b44",
    strand: "#2a283d",
    belly: "#23213a",
    eye: "#f1e2c2",
    arc: "#f1e2c2",
    pupil: "#0b0a12",
    mouth: "#8e8aa8",
    nose: "#4a4766",
    whisk: "#9b98ad",
    lid: "#15141f",
  },
  ginger: {
    fur: "#d9844a",
    ear: "#f2c9a0",
    strand: "#b8652e",
    belly: "#b8652e",
    eye: "#fff6e8",
    arc: "#3a2416",
    pupil: "#2a1a10",
    mouth: "#6b3a1f",
    nose: "#e58a8a",
    whisk: "#fff1e0",
    lid: "#d9844a",
    pat: "tabby",
    stripe: "#b25a24",
    chest: "#f6e2c4",
    paws: "#f6e2c4",
    noBelly: true,
  },
  grey: {
    fur: "#8796ab",
    ear: "#c9d1dc",
    strand: "#6b7a90",
    belly: "#5f6f86",
    eye: "#f4f6f9",
    arc: "#26303d",
    pupil: "#1d2530",
    mouth: "#2f3a48",
    nose: "#e5a3a8",
    whisk: "#eef2f6",
    lid: "#8796ab",
    pat: "tabby",
    stripe: "#5f6f86",
  },
  calico: {
    fur: "#fbf7f0",
    ear: "#f6c6b8",
    strand: "#e3d8c8",
    belly: "#e3d8c8",
    eye: "#ffffff",
    arc: "#2a2230",
    pupil: "#2a2230",
    mouth: "#5a4a5a",
    nose: "#e58a8a",
    whisk: "#4a4458",
    lid: "#fbf7f0",
    pat: "calico",
    outline: "#d9cdb9",
    noBelly: true,
  },
  siamese: {
    fur: "#efe3cc",
    ear: "#7a5a48",
    earFill: "#4a3328",
    strand: "#dccbab",
    belly: "#d8c49f",
    eye: "#bfe2f5",
    arc: "#f1e2c2",
    pupil: "#1d2530",
    mouth: "#e9d9c0",
    nose: "#1f140f",
    whisk: "#4a3328",
    lid: "#4a3328",
    pat: "siamese",
    paws: "#4a3328",
    outline: "#dccbab",
    noBelly: true,
  },
  frog: {
    smooth: true,
    fur: "#7cc46a",
    ear: "#7cc46a",
    strand: "#5fa64e",
    belly: "#5fa64e",
    eye: "#ffffff",
    arc: "#2d4a22",
    pupil: "#1d2a16",
    mouth: "#2d4a22",
    nose: "frog",
    whisk: "",
    lid: "#7cc46a",
    pat: "frog",
    outline: "#5fa64e",
    noBelly: true,
    paws: "#6ab35a",
  },
  dog: {
    fur: "#c98b55",
    ear: "#8a5530",
    strand: "#b07444",
    belly: "#b07444",
    eye: "#fff8ee",
    arc: "#3a2416",
    pupil: "#2a1a10",
    mouth: "#3a2416",
    nose: "big",
    whisk: "",
    lid: "#c98b55",
    pat: "dog",
    noBelly: true,
    paws: "#f1d9b8",
  },
  fox: {
    fur: "#e8823a",
    ear: "#fff1e0",
    earFill: "#e8823a",
    strand: "#c9672a",
    belly: "#c9672a",
    eye: "#fff8ee",
    arc: "#3a2416",
    pupil: "#2a1a10",
    mouth: "#3a2416",
    nose: "#2a1a10",
    whisk: "#3a2416",
    lid: "#e8823a",
    pat: "fox",
    noBelly: true,
    paws: "#3a2a22",
  },
  panda: {
    fur: "#f7f5f0",
    ear: "#1b1b1f",
    strand: "#e3ded2",
    belly: "#e3ded2",
    eye: "#ffffff",
    arc: "#ffffff",
    pupil: "#111114",
    mouth: "#2a2a2a",
    nose: "#111114",
    whisk: "",
    lid: "#1b1b1f",
    pat: "panda",
    outline: "#d9d4c8",
    noBelly: true,
    paws: "#1b1b1f",
  },
  cow: {
    smooth: true,
    fur: "#fbfaf7",
    ear: "#f6b8c2",
    strand: "#e3ded2",
    belly: "#e3ded2",
    eye: "#ffffff",
    arc: "#2a2230",
    pupil: "#2a2230",
    mouth: "#7a3a4a",
    nose: "none",
    whisk: "",
    lid: "#fbfaf7",
    pat: "cow",
    outline: "#d9d4c8",
    noBelly: true,
    paws: "#3a3340",
  },
  penguin: {
    smooth: true,
    fur: "#22264a",
    ear: "#22264a",
    strand: "#2e3360",
    belly: "#2e3360",
    eye: "#ffffff",
    arc: "#22264a",
    pupil: "#14172e",
    mouth: "#22264a",
    nose: "beak",
    whisk: "",
    lid: "#ffffff",
    pat: "penguin",
    noBelly: true,
    paws: "#f2a33a",
  },
  tuxedo: {
    fur: "#15141f",
    ear: "#2e2b44",
    strand: "#2a283d",
    belly: "#23213a",
    eye: "#f1e2c2",
    arc: "#f1e2c2",
    pupil: "#0b0a12",
    mouth: "#4a4766",
    nose: "#e58a8a",
    whisk: "#ffffff",
    lid: "#15141f",
    pat: "tuxedo",
    paws: "#ffffff",
    noBelly: true,
  },
};
