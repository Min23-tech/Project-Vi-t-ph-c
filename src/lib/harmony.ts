import type { Colors } from '../types';

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export const HEX_RE = /^#[0-9a-f]{6}$/i;

export function hexToHsl(hex: string): Hsl {
  if (!HEX_RE.test(hex)) throw new Error(`Mã màu không hợp lệ: ${hex}`);
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: h * 60, s, l };
}

export function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/** Màu trung tính: gần trắng, gần đen hoặc gần xám. */
export function isNeutral({ s, l }: Hsl): boolean {
  return s < 0.15 || l > 0.93 || l < 0.1;
}

export function isWhiteish(hex: string): boolean {
  const { s, l } = hexToHsl(hex);
  return l > 0.88 && s < 0.5;
}

export function isBlackish(hex: string): boolean {
  return hexToHsl(hex).l < 0.15;
}

/** Màu đỏ – vàng rực thường thấy ở áo cô dâu. */
export function isBridalRed(hex: string): boolean {
  const { h, s, l } = hexToHsl(hex);
  return (h < 15 || h > 340) && s > 0.5 && l > 0.25 && l < 0.6;
}

export type Scheme =
  | 'trung-tinh'
  | 'don-sac'
  | 'tuong-dong'
  | 'bo-tuc'
  | 'bo-ba'
  | 'tu-do';

export const SCHEME_LABEL: Record<Scheme, string> = {
  'trung-tinh': 'Trung tính',
  'don-sac': 'Đơn sắc',
  'tuong-dong': 'Tương đồng',
  'bo-tuc': 'Bổ túc',
  'bo-ba': 'Bộ ba',
  'tu-do': 'Phối tự do',
};

export interface HarmonyResult {
  score: number;
  level: 'rat-hai-hoa' | 'hai-hoa' | 'can-nhac' | 'choi';
  label: string;
  scheme: Scheme;
  notes: string[];
}

const LEVEL_LABEL: Record<HarmonyResult['level'], string> = {
  'rat-hai-hoa': 'Rất hài hòa',
  'hai-hoa': 'Khá hài hòa',
  'can-nhac': 'Cần cân nhắc',
  choi: 'Dễ bị chỏi',
};

function uniqueHues(hues: number[]): number[] {
  const out: number[] = [];
  for (const h of hues) if (!out.some((o) => hueDistance(o, h) < 12)) out.push(h);
  return out;
}

function detectScheme(chromatic: Hsl[]): Scheme {
  if (chromatic.length === 0) return 'trung-tinh';
  const hues = uniqueHues(chromatic.map((c) => c.h));
  if (hues.length === 1) return 'don-sac';
  const pairs: number[] = [];
  for (let i = 0; i < hues.length; i++)
    for (let j = i + 1; j < hues.length; j++) pairs.push(hueDistance(hues[i], hues[j]));
  if (pairs.every((d) => d <= 60)) return 'tuong-dong';
  if (hues.length === 3 && pairs.every((d) => d >= 95 && d <= 145)) return 'bo-ba';
  if (pairs.some((d) => d >= 150)) return 'bo-tuc';
  return 'tu-do';
}

/**
 * Chấm điểm hài hòa màu (0–100) dựa trên lý thuyết vòng tròn màu:
 * các cặp màu rực có góc lệch "lưng chừng" (65–110°) dễ chỏi,
 * màu bổ túc cùng độ rực dễ "rung", quá nhiều màu rực làm rối mắt.
 */
export function evaluateHarmony(colors: Colors): HarmonyResult {
  const all = [colors.primary, colors.secondary, colors.accent, colors.bottom].map(hexToHsl);
  const chromatic = all.filter((c) => !isNeutral(c));
  const notes: string[] = [];
  let score = 100;

  const vivid = chromatic.filter((c) => c.s > 0.55 && c.l > 0.25 && c.l < 0.75);
  let clashes = 0;
  let vibrating = 0;
  for (let i = 0; i < vivid.length; i++) {
    for (let j = i + 1; j < vivid.length; j++) {
      const d = hueDistance(vivid[i].h, vivid[j].h);
      const sameLight = Math.abs(vivid[i].l - vivid[j].l) < 0.15;
      if (d >= 65 && d <= 110) clashes++;
      else if (d >= 150 && sameLight) vibrating++;
    }
  }
  if (clashes > 0) {
    score -= Math.min(45, 25 * clashes);
    notes.push('Có cặp màu rực lệch nhau khoảng 65–110° trên vòng màu, dễ tạo cảm giác chỏi. Hãy làm nhạt một màu hoặc đổi sang màu gần nhau hơn.');
  }
  if (vibrating > 0) {
    score -= Math.min(20, 10 * vibrating);
    notes.push('Cặp màu bổ túc cùng độ rực và độ sáng dễ gây "rung" mắt. Giảm độ rực hoặc tăng chênh lệch sáng tối.');
  }

  const distinctHues = uniqueHues(chromatic.map((c) => c.h)).length;
  if (distinctHues >= 4) {
    score -= 20;
    notes.push('Dùng bốn gam màu khác nhau khiến tổng thể rối. Giữ tối đa ba gam, còn lại dùng màu trung tính.');
  } else if (vivid.length >= 3 && chromatic.length === all.length) {
    score -= 10;
    notes.push('Toàn bộ các mảng đều là màu rực. Thêm một màu trung tính (trắng ngà, đen, be) để mắt được nghỉ.');
  }

  const [p, s] = all;
  if (Math.abs(p.l - s.l) < 0.08 && hueDistance(p.h, s.h) > 25 && !isNeutral(p) && !isNeutral(s)) {
    score -= 10;
    notes.push('Màu thân áo và màu viền/lót có độ sáng gần bằng nhau nhưng khác gam, chi tiết viền sẽ khó nổi.');
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const scheme = detectScheme(chromatic);
  if (notes.length === 0) {
    notes.push(
      scheme === 'trung-tinh'
        ? 'Bảng màu trung tính, thanh lịch; có thể thêm một điểm nhấn màu ở phụ kiện.'
        : `Bảng màu ${SCHEME_LABEL[scheme].toLowerCase()} cân đối.`,
    );
  }
  const level: HarmonyResult['level'] =
    score >= 80 ? 'rat-hai-hoa' : score >= 60 ? 'hai-hoa' : score >= 40 ? 'can-nhac' : 'choi';
  return { score, level, label: LEVEL_LABEL[level], scheme, notes };
}
