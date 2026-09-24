export type GarmentId = 'ao-dai' | 'ao-ngu-than' | 'ao-tu-than' | 'ao-ba-ba' | 'ao-nhat-binh';
export type BottomId =
  | 'quan-lua'
  | 'vay-dup'
  | 'chan-vay-dai'
  | 'quan-ong-suong'
  | 'quan-jeans'
  | 'chan-vay-ngan';
export type FabricId = 'lua-to-tam' | 'lua-pha' | 'voan' | 'gam' | 'nhung' | 'dui';
export type PatternId = 'tron' | 'hoa-nhi' | 'hoa-sen' | 'van-may' | 'chu-tho' | 'rong';
export type StyleId = 'truyen-thong' | 'toi-gian' | 'street' | 'vintage' | 'pastel';
export type EventId =
  | 'tet'
  | 'tot-nghiep'
  | 'dam-cuoi'
  | 'le-hoi'
  | 'di-chua'
  | 'dao-pho'
  | 'van-nghe'
  | 'di-hoc';
export type RegionId = 'bac' | 'trung' | 'nam';
export type WeatherId = 'nang-nong' | 'mat-me' | 'lanh' | 'mua';
export type Slot = 'head' | 'neck' | 'hand' | 'waist' | 'feet';
export type Body = 'nu' | 'nam';
export type HairId = 'dai' | 'bui' | 'ngan';

/** Mức độ tin cậy của một thông tin văn hóa. */
export type Confidence = 'su-lieu' | 'pho-bien' | 'tranh-luan';

export interface Fact {
  text: string;
  confidence: Confidence;
}

export interface Source {
  title: string;
  detail: string;
}

export interface Garment {
  id: GarmentId;
  name: string;
  tagline: string;
  region: RegionId[];
  era: string;
  /** Giới tính mặc theo truyền thống. */
  traditionalBodies: Body[];
  /** 1 = đời thường, 3 = lễ phục. */
  formality: 1 | 2 | 3;
  origin: Fact[];
  structure: string[];
  meaning: Fact[];
  occasions: string[];
  confusedWith: { name: string; difference: string }[];
  respectNotes: string[];
  traditionalBottoms: BottomId[];
  traditionalAccessories: string[];
  sources: Source[];
}

export interface Bottom {
  id: BottomId;
  name: string;
  /** 0 = truyền thống, 3 = biến tấu mạnh. */
  remix: 0 | 1 | 2 | 3;
  formalityShift: number;
  skirt: boolean;
  short: boolean;
  note: string;
}

export interface Fabric {
  id: FabricId;
  name: string;
  note: string;
  breathable: boolean;
  warm: boolean;
  rainSensitive: boolean;
  sheen: number;
}

export interface Pattern {
  id: PatternId;
  name: string;
  meaning: string;
}

export interface Accessory {
  id: string;
  name: string;
  slot: Slot;
  /** Vùng gắn bó; rỗng = phổ biến toàn quốc hoặc hiện đại. */
  region: RegionId[];
  modern: boolean;
  formalityShift: number;
  note: string;
}

export interface Style {
  id: StyleId;
  name: string;
  description: string;
  remix: 0 | 1 | 2 | 3;
  formalityShift: number;
  palette: [string, string, string, string];
  tips: string[];
}

export interface EventInfo {
  id: EventId;
  name: string;
  /** 0 = thoải mái tuyệt đối, 3 = trang trọng. */
  formality: 0 | 1 | 2 | 3;
  maxRemix: 0 | 1 | 2 | 3;
  garments: GarmentId[];
  palette: [string, string, string, string];
  tips: string[];
}

export interface Region {
  id: RegionId;
  name: string;
  highlight: string;
}

export interface Weather {
  id: WeatherId;
  name: string;
  fabrics: FabricId[];
  tips: string[];
}

export interface Colors {
  primary: string;
  secondary: string;
  accent: string;
  bottom: string;
}

export interface Avatar {
  body: Body;
  skin: number;
  hair: HairId;
}

export interface Look {
  garment: GarmentId;
  bottom: BottomId;
  fabric: FabricId;
  pattern: PatternId;
  colors: Colors;
  style: StyleId;
  accessories: Record<Slot, string | null>;
  avatar: Avatar;
}

export interface LookContext {
  event: EventId | null;
  region: RegionId | null;
  weather: WeatherId | null;
}

export interface SavedLook {
  id: string;
  name: string;
  note: string;
  look: Look;
  context: LookContext;
  createdAt: number;
}

export type Severity = 'nghiem-trong' | 'luu-y' | 'goi-y';

export interface Warning {
  id: string;
  severity: Severity;
  title: string;
  why: string;
  fix?: string;
}
