import type { ClientLogo } from './calibrationBriefPdf';

/** Convert an uploaded logo to a JPEG (white background) that can be embedded in the PDF. */
export async function readClientLogo(file: File): Promise<{ preview: string; logo: ClientLogo }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error('Unsupported image'));
      i.src = url;
    });
    const nw = img.naturalWidth || 300;
    const nh = img.naturalHeight || 120;
    const scale = Math.min(1, 640 / nw, 260 / nh);
    const width = Math.max(1, Math.round(nw * scale));
    const height = Math.max(1, Math.round(nh * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    return { preview: dataUrl, logo: { jpeg: atob(dataUrl.split(',')[1]), width, height } };
  } finally {
    URL.revokeObjectURL(url);
  }
}
