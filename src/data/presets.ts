import { buildSuggestedLook } from '../lib/recommend';
import type { GarmentId, Look, LookContext, SavedLook, StyleId } from '../types';

interface PresetSpec {
  id: string;
  name: string;
  note: string;
  garment: GarmentId;
  context: LookContext;
  style: StyleId;
  patch?: (look: Look) => Look;
}

const SPECS: PresetSpec[] = [
  {
    id: 'mau-tet-pho-co',
    name: 'Tết phố cổ',
    note: 'Áo dài gấm đỏ điều họa tiết chữ Thọ, khăn vấn, hài thêu: đi chúc Tết ông bà ngày se lạnh.',
    garment: 'ao-dai',
    context: { event: 'tet', region: 'bac', weather: 'lanh' },
    style: 'truyen-thong',
    patch: (l) => ({ ...l, accessories: { ...l.accessories, head: 'khan-van', feet: 'hai-theu' } }),
  },
  {
    id: 'mau-quan-ho',
    name: 'Liền chị Quan họ',
    note: 'Áo tứ thân nâu, yếm hồng đào, thắt lưng xanh hoa lý, nón quai thao: trọn bộ trang phục hội Lim.',
    garment: 'ao-tu-than',
    context: { event: 'le-hoi', region: 'bac', weather: 'mat-me' },
    style: 'truyen-thong',
    patch: (l) => ({
      ...l,
      colors: { primary: '#7B4A2E', secondary: '#F4A7B9', accent: '#7FB77E', bottom: '#1C1C1E' },
      pattern: 'tron',
      fabric: 'dui',
      accessories: { head: 'non-quai-thao', neck: null, hand: null, waist: 'that-lung-lua', feet: 'guoc-moc' },
    }),
  },
  {
    id: 'mau-ky-yeu',
    name: 'Kỷ yếu pastel',
    note: 'Áo dài hồng đào hoa nhí, chân váy xòe: nhẹ nhàng cho buổi chụp kỷ yếu.',
    garment: 'ao-dai',
    context: { event: 'tot-nghiep', region: 'nam', weather: 'nang-nong' },
    style: 'pastel',
  },
  {
    id: 'mau-hue',
    name: 'Chiều Huế',
    note: 'Áo Nhật Bình tím Huế, lá cổ vàng nghệ thêu vân mây, khăn vấn, hài thêu cho Festival Huế.',
    garment: 'ao-nhat-binh',
    context: { event: 'le-hoi', region: 'trung', weather: 'mat-me' },
    style: 'truyen-thong',
    patch: (l) => ({
      ...l,
      colors: { primary: '#5B2C6F', secondary: '#E3A00F', accent: '#F6D58E', bottom: '#F7F3E8' },
    }),
  },
  {
    id: 'mau-mien-tay',
    name: 'Miền Tây sông nước',
    note: 'Áo bà ba đũi, khăn rằn, nón lá, quần đen: dạo chợ nổi và nghe đờn ca tài tử.',
    garment: 'ao-ba-ba',
    context: { event: 'le-hoi', region: 'nam', weather: 'nang-nong' },
    style: 'truyen-thong',
    patch: (l) => ({
      ...l,
      colors: { primary: '#F7F3E8', secondary: '#7B4A2E', accent: '#7B4A2E', bottom: '#1C1C1E' },
      pattern: 'tron',
      fabric: 'dui',
      accessories: { head: 'non-la', neck: 'khan-ran', hand: null, waist: null, feet: 'guoc-moc' },
    }),
  },
  {
    id: 'mau-dao-pho',
    name: 'Sài Gòn xuống phố',
    note: 'Áo dài chàm phối jeans, sneaker, túi mini: giữ phom áo, biến tấu phần dưới.',
    garment: 'ao-dai',
    context: { event: 'dao-pho', region: 'nam', weather: 'nang-nong' },
    style: 'street',
  },
  {
    id: 'mau-ngu-than-nam',
    name: 'Khách mời áo ngũ thân',
    note: 'Áo ngũ thân nam xanh lam, khăn đóng, hài thêu: lịch sự khi dự lễ cưới.',
    garment: 'ao-ngu-than',
    context: { event: 'dam-cuoi', region: 'trung', weather: 'mat-me' },
    style: 'truyen-thong',
    patch: (l) => ({
      ...l,
      colors: { primary: '#2E5E9E', secondary: '#F7F3E8', accent: '#E3A00F', bottom: '#F7F3E8' },
      pattern: 'van-may',
    }),
  },
];

export const PRESETS: SavedLook[] = SPECS.map((s) => {
  const avatar = s.id === 'mau-ngu-than-nam' ? { body: 'nam' as const, skin: 2, hair: 'ngan' as const } : { body: 'nu' as const, skin: s.id === 'mau-mien-tay' ? 2 : 1, hair: s.id === 'mau-hue' || s.id === 'mau-tet-pho-co' ? ('bui' as const) : ('dai' as const) };
  const base = buildSuggestedLook(s.garment, s.context, s.style, avatar);
  return {
    id: s.id,
    name: s.name,
    note: s.note,
    look: s.patch ? s.patch(base) : base,
    context: s.context,
    createdAt: 0,
  };
});
