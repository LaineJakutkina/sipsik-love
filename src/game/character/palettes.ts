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
  | "beaver"
  | "anon"
  | "vampire"
  | "tuxedo"
  | "joker"
  | "carer"
  | "scholar";

/** Special noses; anything else is a colour for the default triangle nose */
export type NoseStyle =
  | "none"
  | "frog"
  | "beak"
  | "big"
  | "beaver"
  | "vamp"
  | (string & {});

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
  beaver: {
    fur: "#9a6338",
    ear: "#5e3b20",
    earFill: "#9a6338",
    strand: "#7f4f2b",
    belly: "#7f4f2b",
    eye: "#fff8ee",
    arc: "#2a1a10",
    pupil: "#2a1a10",
    mouth: "#2a1a10",
    nose: "beaver",
    whisk: "#3a2416",
    lid: "#9a6338",
    pat: "beaver",
    noBelly: true,
    paws: "#5a3a22",
  },
  anon: {
    smooth: true,
    fur: "#2b2d3a",
    ear: "#2b2d3a",
    strand: "#23252f",
    belly: "#23252f",
    eye: "#7dffb0",
    arc: "#7dffb0",
    pupil: "#0b3a20",
    mouth: "#7dffb0",
    nose: "none",
    whisk: "",
    lid: "#0e0f16",
    pat: "anon",
    outline: "#181922",
    noBelly: true,
    paws: "#181922",
  },
  vampire: {
    fur: "#ddd6ea",
    ear: "#b9a8d0",
    earFill: "#ddd6ea",
    strand: "#c4bcd6",
    belly: "#c4bcd6",
    eye: "#fff2f2",
    arc: "#3a1626",
    pupil: "#b3122e",
    mouth: "#3a1626",
    nose: "vamp",
    whisk: "#8a7fa0",
    lid: "#ddd6ea",
    pat: "vampire",
    outline: "#c4bcd6",
    noBelly: true,
    paws: "#2a1a2e",
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
  joker: {
    fur: "#f2c14e",
    ear: "#f7dc95",
    strand: "#d9a32e",
    belly: "#d9a32e",
    eye: "#fffaf0",
    arc: "#3a2a10",
    pupil: "#2a1d08",
    mouth: "#6b4a12",
    nose: "#e58a8a",
    whisk: "#fff6dd",
    lid: "#f2c14e",
    pat: "joker",
    paws: "#f7dc95",
    noBelly: true,
  },
  carer: {
    fur: "#f4c6c0",
    ear: "#e8939a",
    strand: "#e3a8a2",
    belly: "#e3a8a2",
    eye: "#fffafa",
    arc: "#5a2e34",
    pupil: "#3a1c22",
    mouth: "#8a4a52",
    nose: "#e06c7c",
    whisk: "#fff4f2",
    lid: "#f4c6c0",
    pat: "carer",
    paws: "#fbe3df",
    noBelly: true,
  },
  scholar: {
    fur: "#9aa7b8",
    ear: "#c9d2de",
    strand: "#7f8c9e",
    belly: "#7f8c9e",
    eye: "#fbfcff",
    arc: "#222a36",
    pupil: "#151b24",
    mouth: "#3b4656",
    nose: "#d98a92",
    whisk: "#eef2f7",
    lid: "#9aa7b8",
    pat: "scholar",
    paws: "#c9d2de",
    noBelly: true,
  },
};
