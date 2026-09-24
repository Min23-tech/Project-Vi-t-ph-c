import { colorName } from '../data/catalog';
import type { Colors } from '../types';

export interface CardInfo {
  name: string;
  lines: string[];
  colors: Colors;
  score: number;
}

function loadSvg(svg: SVGSVGElement): Promise<HTMLImageElement> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('width', '640');
  clone.setAttribute('height', '1120');
  const text = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml;charset=utf-8' }));
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Không dựng được hình từ SVG'));
    };
    img.src = url;
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const out: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > maxWidth && line) {
      out.push(line);
      line = w;
    } else line = next;
  }
  if (line) out.push(line);
  return out;
}

/** Vẽ thẻ lookbook 1080×1350 (tỉ lệ 4:5 phù hợp mạng xã hội). */
export async function renderCard(svg: SVGSVGElement, info: CardInfo): Promise<Blob> {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Trình duyệt không hỗ trợ canvas');
  const font = '"Be Vietnam Pro", "Segoe UI", system-ui, sans-serif';

  ctx.fillStyle = '#F1EFEA';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#E4E1F0';
  ctx.beginPath();
  ctx.ellipse(300, 700, 280, 560, 0, 0, Math.PI * 2);
  ctx.fill();

  const img = await loadSvg(svg);
  ctx.drawImage(img, 40, 90, 520, 910);

  const x = 610;
  ctx.fillStyle = '#2F3A8F';
  ctx.font = `600 26px ${font}`;
  ctx.fillText('VIỆT PHỤC REMIX · LOOKBOOK', x, 150);
  ctx.fillStyle = '#1D1B2C';
  ctx.font = `700 48px ${font}`;
  let y = 222;
  for (const l of wrap(ctx, info.name, 430).slice(0, 3)) {
    ctx.fillText(l, x, y);
    y += 58;
  }
  ctx.fillStyle = '#2F3A8F';
  ctx.font = `700 30px ${font}`;
  ctx.fillText(`Điểm phù hợp ${info.score}/100`, x, y + 6);
  y += 60;
  ctx.font = `400 25px ${font}`;
  ctx.fillStyle = '#3B3950';
  for (const line of info.lines) {
    for (const l of wrap(ctx, line, 430).slice(0, 3)) {
      ctx.fillText(l, x, y);
      y += 35;
    }
    y += 8;
  }

  y = Math.min(y + 24, 1250 - 24 - 4 * 64);
  ctx.font = `600 24px ${font}`;
  ctx.fillStyle = '#1D1B2C';
  ctx.fillText('Bảng màu', x, y);
  y += 24;
  const entries: [string, string][] = [
    ['Thân áo', info.colors.primary],
    ['Viền / lót', info.colors.secondary],
    ['Điểm nhấn', info.colors.accent],
    ['Quần / váy', info.colors.bottom],
  ];
  ctx.font = `400 24px ${font}`;
  for (const [label, hex] of entries) {
    ctx.fillStyle = hex;
    ctx.fillRect(x, y, 50, 50);
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.strokeRect(x, y, 50, 50);
    ctx.fillStyle = '#3B3950';
    ctx.fillText(`${label}: ${colorName(hex) ?? hex}`, x + 68, y + 34);
    y += 64;
  }

  ctx.fillStyle = '#6B6880';
  ctx.font = `400 22px ${font}`;
  ctx.fillText('Hình minh họa mang tính gợi ý. Thông tin văn hóa kèm nguồn trong ứng dụng.', 60, 1290);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Không tạo được ảnh'))), 'image/png'),
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function slugify(text: string): string {
  return (
    text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'viet-phuc'
  );
}

/** Thu nhỏ ảnh người dùng tải lên (chỉ xử lý trên máy, không gửi đi đâu). */
export function readPhoto(file: File, size = 240): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Tệp không phải ảnh.'));
    if (file.size > 15 * 1024 * 1024) return reject(new Error('Ảnh lớn hơn 15 MB, hãy chọn ảnh nhỏ hơn.'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không đọc được ảnh.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Định dạng ảnh không được hỗ trợ.'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Trình duyệt không hỗ trợ canvas.'));
        const s = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
