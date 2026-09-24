import { describe, expect, it } from 'vitest';
import { ACCESSORY_BY_ID, BOTTOM_BY_ID, EVENTS, REGIONS, STYLES, TRADITIONAL_COLORS, WEATHERS } from '../data/catalog';
import { GARMENTS } from '../data/garments';
import type { Look, LookContext } from '../types';
import { evaluateHarmony, hexToHsl, hueDistance } from './harmony';
import { buildSuggestedLook, DEFAULT_LOOK, suggestGarments } from './recommend';
import { checkLook, formalityOf, overallScore } from './rules';
import { decodeShare, encodeShare, sanitizeLook } from './share';

const ctx = (c: Partial<LookContext> = {}): LookContext => ({ event: null, region: null, weather: null, ...c });
const withLook = (patch: Partial<Look>): Look => ({ ...DEFAULT_LOOK, ...patch });

describe('dữ liệu', () => {
  it('mọi tham chiếu phụ kiện, phần dưới đều tồn tại', () => {
    for (const g of GARMENTS) {
      for (const a of g.traditionalAccessories) expect(ACCESSORY_BY_ID[a], `${g.id}:${a}`).toBeDefined();
      for (const b of g.traditionalBottoms) expect(BOTTOM_BY_ID[b], `${g.id}:${b}`).toBeDefined();
      expect(g.sources.length).toBeGreaterThan(0);
    }
  });
  it('mã màu hợp lệ', () => {
    for (const c of TRADITIONAL_COLORS) expect(() => hexToHsl(c.hex)).not.toThrow();
    for (const s of STYLES) s.palette.forEach((h) => expect(() => hexToHsl(h)).not.toThrow());
    for (const e of EVENTS) e.palette.forEach((h) => expect(() => hexToHsl(h)).not.toThrow());
  });
});

describe('hài hòa màu', () => {
  it('khoảng cách sắc độ vòng tròn', () => {
    expect(hueDistance(350, 10)).toBe(20);
    expect(hueDistance(0, 180)).toBe(180);
  });
  it('bảng màu trung tính luôn hài hòa', () => {
    const r = evaluateHarmony({ primary: '#F7F3E8', secondary: '#1C1C1E', accent: '#808080', bottom: '#F7F3E8' });
    expect(r.scheme).toBe('trung-tinh');
    expect(r.score).toBeGreaterThanOrEqual(80);
  });
  it('đỏ rực + xanh lá rực + tím rực + vàng bị chấm thấp', () => {
    const r = evaluateHarmony({ primary: '#FF0000', secondary: '#00C000', accent: '#8000FF', bottom: '#FFD700' });
    expect(r.score).toBeLessThan(40);
    expect(r.level).toBe('choi');
  });
  it('bảng màu của phong cách và sự kiện đều hài hòa', () => {
    for (const p of [...STYLES.map((s) => s.palette), ...EVENTS.map((e) => e.palette)]) {
      const [primary, secondary, accent, bottom] = p;
      expect(evaluateHarmony({ primary, secondary, accent, bottom }).score, p.join()).toBeGreaterThanOrEqual(80);
    }
  });
});

describe('cảnh báo văn hóa', () => {
  it('áo dài + váy ngắn là nghiêm trọng', () => {
    const w = checkLook(withLook({ bottom: 'chan-vay-ngan' }), ctx());
    expect(w[0].id).toBe('phan-duoi-ngan');
    expect(w[0].severity).toBe('nghiem-trong');
  });
  it('Nhật Bình phối sneaker bị lưu ý', () => {
    const look = withLook({ garment: 'ao-nhat-binh', accessories: { ...DEFAULT_LOOK.accessories, feet: 'sneaker' } });
    expect(checkLook(look, ctx()).some((w) => w.id === 'nhat-binh-duong-pho')).toBe(true);
  });
  it('pha trộn vùng miền được ghi nhận', () => {
    const look = withLook({ garment: 'ao-ba-ba', accessories: { ...DEFAULT_LOOK.accessories, head: 'non-quai-thao' } });
    expect(checkLook(look, ctx()).some((w) => w.id === 'vung-mien-non-quai-thao')).toBe(true);
  });
  it('Tết mặc áo trắng bị lưu ý', () => {
    const look = withLook({ colors: { ...DEFAULT_LOOK.colors, primary: '#FFFFFF' } });
    expect(checkLook(look, ctx({ event: 'tet' })).some((w) => w.id === 'tet-mau-tang')).toBe(true);
  });
  it('đám cưới: áo bà ba + jeans chưa đủ trang trọng', () => {
    const look = withLook({ garment: 'ao-ba-ba', bottom: 'quan-jeans' });
    expect(formalityOf(look)).toBe(0);
    const w = checkLook(look, ctx({ event: 'dam-cuoi' })).find((x) => x.id === 'do-trang-trong');
    expect(w?.severity).toBe('nghiem-trong');
  });
  it('trời mưa + lụa tơ tằm + guốc mộc', () => {
    const look = withLook({ fabric: 'lua-to-tam', accessories: { ...DEFAULT_LOOK.accessories, feet: 'guoc-moc' } });
    const ids = checkLook(look, ctx({ weather: 'mua' })).map((w) => w.id);
    expect(ids).toContain('mua-vai');
    expect(ids).toContain('mua-guoc');
  });
  it('cảnh báo được sắp xếp theo mức độ', () => {
    const look = withLook({ bottom: 'chan-vay-ngan', pattern: 'rong', colors: { ...DEFAULT_LOOK.colors, primary: '#FFFFFF' } });
    const order = { 'nghiem-trong': 0, 'luu-y': 1, 'goi-y': 2 };
    const sev = checkLook(look, ctx({ event: 'tet' })).map((w) => order[w.severity]);
    expect(sev).toEqual([...sev].sort());
  });
});

describe('gợi ý', () => {
  it('Quan họ Bắc Bộ gợi ý áo tứ thân đầu tiên', () => {
    expect(suggestGarments(ctx({ event: 'van-nghe', region: 'bac' }))[0].garment).toBe('ao-tu-than');
  });
  it('lễ hội Nam Bộ gợi ý áo bà ba', () => {
    expect(suggestGarments(ctx({ event: 'le-hoi', region: 'nam' }))[0].garment).toBe('ao-ba-ba');
  });
  it('mọi gợi ý hàng đầu không có cảnh báo nghiêm trọng hoặc lưu ý', () => {
    const events = [null, ...EVENTS.map((e) => e.id)];
    const regions = [null, ...REGIONS.map((r) => r.id)];
    const weathers = [null, ...WEATHERS.map((w) => w.id)];
    for (const event of events)
      for (const region of regions)
        for (const weather of weathers)
          for (const style of STYLES)
            for (const body of ['nu', 'nam'] as const) {
              const c = { event, region, weather };
              const avatar = { body, skin: 0, hair: 'dai' as const };
              const top = suggestGarments(c, avatar)[0];
              const look = buildSuggestedLook(top.garment, c, style.id, avatar);
              const bad = checkLook(look, c).filter((w) => w.severity !== 'goi-y');
              expect(bad, JSON.stringify({ c, style: style.id, body, garment: top.garment, bad })).toEqual([]);
            }
  });
  it('điểm tổng nằm trong 0–100', () => {
    const s = overallScore(withLook({ bottom: 'chan-vay-ngan', pattern: 'rong' }), ctx({ event: 'dam-cuoi', weather: 'mua' }));
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(100);
  });
});

describe('chia sẻ', () => {
  it('mã hóa và giải mã giữ nguyên dữ liệu, kể cả tiếng Việt', () => {
    const saved = { id: 'a', name: 'Tết Hà Nội ấm áp', note: 'Áo dài đỏ điều', look: DEFAULT_LOOK, context: ctx({ event: 'tet' }), createdAt: 1 };
    const decoded = decodeShare(encodeShare([saved]));
    expect(decoded?.looks[0].name).toBe('Tết Hà Nội ấm áp');
    expect(decoded?.looks[0].look).toEqual(DEFAULT_LOOK);
    expect(decoded?.looks[0].context.event).toBe('tet');
  });
  it('dữ liệu hỏng hoặc độc hại bị loại bỏ', () => {
    expect(decodeShare('!!!')).toBeNull();
    const look = sanitizeLook({ garment: '<script>', colors: { primary: 'red' }, accessories: { head: 'sneaker' }, avatar: { skin: 99 } });
    expect(look.garment).toBe(DEFAULT_LOOK.garment);
    expect(look.colors.primary).toBe(DEFAULT_LOOK.colors.primary);
    expect(look.accessories.head).toBeNull();
    expect(look.avatar.skin).toBe(DEFAULT_LOOK.avatar.skin);
  });
});

import { PRESETS } from '../data/presets';
import { GARMENT_BY_ID } from '../data/garments';

describe('bộ mẫu', () => {
  it('bộ mẫu không có cảnh báo nghiêm trọng/lưu ý và màu hài hòa', () => {
    for (const p of PRESETS) {
      const bad = checkLook(p.look, p.context).filter((w) => w.severity !== 'goi-y');
      expect(bad, p.id).toEqual([]);
      expect(evaluateHarmony(p.look.colors).score, p.id).toBeGreaterThanOrEqual(60);
    }
  });
  it('mô tả bộ mẫu khớp với dữ liệu', () => {
    for (const p of PRESETS) expect(p.note.length).toBeGreaterThan(10);
    const quanHo = PRESETS.find((p) => p.id === 'mau-quan-ho')!;
    expect(GARMENT_BY_ID[quanHo.look.garment].name).toBe('Áo tứ thân');
    expect(quanHo.look.bottom).toBe('vay-dup');
  });
});
