import type { Photo } from "@/domain/types";

function shrink(img: HTMLImageElement, max: number, quality: number): string {
  const k = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * k);
  canvas.height = Math.round(img.height * k);
  canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

/** Full photo (up to 1200px) and a list thumbnail (up to 420px), both JPEG data URLs */
export async function readPhoto(file: File): Promise<Photo> {
  const img = await loadImage(file);
  return { full: shrink(img, 1200, 0.82), thumb: shrink(img, 420, 0.75) };
}
