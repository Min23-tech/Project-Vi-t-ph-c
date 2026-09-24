import { ACCESSORY_BY_ID, EVENT_BY_ID, STYLE_BY_ID, WEATHER_BY_ID } from '../data/catalog';
import { GARMENTS, GARMENT_BY_ID } from '../data/garments';
import type {
  Avatar,
  BottomId,
  FabricId,
  GarmentId,
  Look,
  LookContext,
  PatternId,
  Slot,
  StyleId,
} from '../types';

export const DEFAULT_AVATAR: Avatar = { body: 'nu', skin: 1, hair: 'dai' };

export interface GarmentSuggestion {
  garment: GarmentId;
  score: number;
  reasons: string[];
}

export function suggestGarments(ctx: LookContext, avatar: Avatar = DEFAULT_AVATAR): GarmentSuggestion[] {
  const event = ctx.event ? EVENT_BY_ID[ctx.event] : null;
  return GARMENTS.map((g) => {
    let score = 0;
    const reasons: string[] = [];
    if (event) {
      const idx = event.garments.indexOf(g.id);
      if (idx >= 0) {
        score += 40 - idx * 5;
        reasons.push(`Thường thấy trong dịp ${event.name}`);
      }
      if (g.formality >= event.formality) score += 15;
      else {
        score -= 20;
        reasons.push('Kém trang trọng hơn yêu cầu của dịp này');
      }
    }
    if (ctx.region) {
      if (g.region.includes(ctx.region) && g.region.length < 3) {
        score += 25;
        reasons.push('Đặc trưng của vùng bạn chọn');
      } else if (g.region.includes(ctx.region)) {
        score += 10;
      }
    }
    if (!g.traditionalBodies.includes(avatar.body)) {
      score -= 30;
      reasons.push('Theo truyền thống là trang phục nữ');
    }
    return { garment: g.id, score, reasons };
  }).sort((a, b) => b.score - a.score);
}

/** Chọn phong cách phù hợp với mức biến tấu mà sự kiện cho phép. */
export function effectiveStyle(style: StyleId, ctx: LookContext): StyleId {
  const event = ctx.event ? EVENT_BY_ID[ctx.event] : null;
  if (!event) return style;
  const s = STYLE_BY_ID[style];
  if (s.remix <= event.maxRemix) return style;
  return event.maxRemix >= 1 ? 'toi-gian' : 'truyen-thong';
}

function pickFabric(ctx: LookContext): FabricId {
  const preference: FabricId[] =
    ctx.event === 'tet' || ctx.event === 'dam-cuoi'
      ? ['gam', 'nhung', 'lua-to-tam', 'lua-pha']
      : ctx.event === 'di-hoc'
        ? ['lua-pha', 'lua-to-tam']
        : ['lua-to-tam', 'dui', 'lua-pha', 'voan'];
  const allowed = ctx.weather ? WEATHER_BY_ID[ctx.weather].fabrics : null;
  if (!allowed) return preference[0];
  return preference.find((f) => allowed.includes(f)) ?? allowed[0];
}

function pickPattern(garment: GarmentId, style: StyleId, ctx: LookContext): PatternId {
  if (style === 'toi-gian' || style === 'street') return 'tron';
  if (ctx.event === 'tet') return 'chu-tho';
  if (garment === 'ao-nhat-binh') return 'van-may';
  if (style === 'pastel' || garment === 'ao-ba-ba') return 'hoa-nhi';
  if (ctx.event === 'di-chua') return 'tron';
  if (ctx.event === 'dam-cuoi') return 'hoa-sen';
  return 'tron';
}

function pickBottom(garment: GarmentId, style: StyleId, maxRemix: number): BottomId {
  const base = GARMENT_BY_ID[garment].traditionalBottoms[0];
  if (garment === 'ao-tu-than' || garment === 'ao-nhat-binh') return base;
  if (style === 'street' && maxRemix >= 2) return 'quan-jeans';
  if (style === 'pastel' && garment === 'ao-dai' && maxRemix >= 1) return 'chan-vay-dai';
  if (style === 'toi-gian' && maxRemix >= 1) return 'quan-ong-suong';
  return base;
}

export function buildSuggestedLook(
  garmentId: GarmentId,
  ctx: LookContext,
  requestedStyle: StyleId,
  avatar: Avatar = DEFAULT_AVATAR,
): Look {
  const garment = GARMENT_BY_ID[garmentId];
  const event = ctx.event ? EVENT_BY_ID[ctx.event] : null;
  const maxRemix = event ? event.maxRemix : 3;
  let style = effectiveStyle(requestedStyle, ctx);
  // Trang phục cung đình không phối kiểu đường phố.
  if (garmentId === 'ao-nhat-binh' && style === 'street') style = 'toi-gian';
  const styleInfo = STYLE_BY_ID[style];

  const palette = event && !(styleInfo.remix >= 1 && event.maxRemix >= 2) ? event.palette : styleInfo.palette;
  const colors = { primary: palette[0], secondary: palette[1], accent: palette[2], bottom: palette[3] };
  if (garmentId === 'ao-tu-than') colors.bottom = '#1C1C1E';
  if (garmentId === 'ao-ba-ba' && style === 'truyen-thong') colors.bottom = '#1C1C1E';

  const accessories: Record<Slot, string | null> = { head: null, neck: null, hand: null, waist: null, feet: null };
  const fits = (id: string) => {
    const a = ACCESSORY_BY_ID[id];
    if (!a) return false;
    if (a.region.length && !a.region.some((r) => garment.region.includes(r))) return false;
    if (id === 'khan-dong' && avatar.body !== 'nam') return false;
    if (id === 'khan-van' && avatar.body === 'nam') return false;
    if (id === 'guoc-moc' && ctx.weather === 'mua') return false;
    if (a.formalityShift < 0 && event && garment.formality + a.formalityShift < event.formality) return false;
    return true;
  };
  for (const id of garment.traditionalAccessories) {
    const slot = ACCESSORY_BY_ID[id]?.slot;
    if (slot && !accessories[slot] && fits(id)) accessories[slot] = id;
  }
  if (!accessories.feet) accessories.feet = 'giay-bup-be';
  if (style === 'street' && maxRemix >= 2 && garmentId !== 'ao-nhat-binh') {
    accessories.feet = 'sneaker';
    accessories.hand = 'tui-mini';
  }
  if (style === 'vintage' && garmentId === 'ao-dai') {
    accessories.hand = 'tui-mini';
    accessories.feet = 'giay-bup-be';
  }
  if (style === 'toi-gian') {
    accessories.head = null;
    accessories.neck = null;
  }

  return {
    garment: garmentId,
    bottom: pickBottom(garmentId, style, maxRemix),
    fabric: pickFabric(ctx),
    pattern: pickPattern(garmentId, style, ctx),
    colors,
    style,
    accessories,
    avatar,
  };
}

export const DEFAULT_CONTEXT: LookContext = { event: 'tet', region: 'bac', weather: 'lanh' };
export const DEFAULT_LOOK: Look = buildSuggestedLook('ao-dai', DEFAULT_CONTEXT, 'truyen-thong');
