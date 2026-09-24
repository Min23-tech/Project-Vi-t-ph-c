import {
  ACCESSORY_BY_ID,
  BOTTOM_BY_ID,
  EVENT_BY_ID,
  FABRIC_BY_ID,
  PATTERN_BY_ID,
  REGION_BY_ID,
  SKIN_TONES,
  STYLE_BY_ID,
  WEATHER_BY_ID,
} from '../data/catalog';
import { GARMENT_BY_ID } from '../data/garments';
import type { Look, LookContext, SavedLook, Slot } from '../types';
import { HEX_RE } from './harmony';
import { DEFAULT_LOOK } from './recommend';

const SLOTS: Slot[] = ['head', 'neck', 'hand', 'waist', 'feet'];

type Unknown = Record<string, unknown> | undefined | null;

function pick<T extends string>(value: unknown, table: Record<string, unknown>, fallback: T): T {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(table, value) ? (value as T) : fallback;
}

function pickNullable<T extends string>(value: unknown, table: Record<string, unknown>): T | null {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(table, value) ? (value as T) : null;
}

function hex(value: unknown, fallback: string): string {
  return typeof value === 'string' && HEX_RE.test(value) ? value.toUpperCase() : fallback;
}

/** Làm sạch dữ liệu bộ phối đến từ link chia sẻ hoặc bộ nhớ trình duyệt. */
export function sanitizeLook(raw: unknown): Look {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const d = DEFAULT_LOOK;
  const colors = (r.colors ?? {}) as Unknown;
  const acc = (r.accessories ?? {}) as Unknown;
  const avatar = (r.avatar ?? {}) as Unknown;
  const accessories = {} as Record<Slot, string | null>;
  for (const slot of SLOTS) {
    const id = acc?.[slot];
    accessories[slot] = typeof id === 'string' && ACCESSORY_BY_ID[id]?.slot === slot ? id : null;
  }
  const skin = Number(avatar?.skin);
  return {
    garment: pick(r.garment, GARMENT_BY_ID, d.garment),
    bottom: pick(r.bottom, BOTTOM_BY_ID, d.bottom),
    fabric: pick(r.fabric, FABRIC_BY_ID, d.fabric),
    pattern: pick(r.pattern, PATTERN_BY_ID, d.pattern),
    style: pick(r.style, STYLE_BY_ID, d.style),
    colors: {
      primary: hex(colors?.primary, d.colors.primary),
      secondary: hex(colors?.secondary, d.colors.secondary),
      accent: hex(colors?.accent, d.colors.accent),
      bottom: hex(colors?.bottom, d.colors.bottom),
    },
    accessories,
    avatar: {
      body: avatar?.body === 'nam' ? 'nam' : 'nu',
      skin: Number.isInteger(skin) && skin >= 0 && skin < SKIN_TONES.length ? skin : d.avatar.skin,
      hair: avatar?.hair === 'bui' || avatar?.hair === 'ngan' ? avatar.hair : 'dai',
    },
  };
}

export function sanitizeContext(raw: unknown): LookContext {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    event: pickNullable(r.event, EVENT_BY_ID),
    region: pickNullable(r.region, REGION_BY_ID),
    weather: pickNullable(r.weather, WEATHER_BY_ID),
  };
}

function cleanText(value: unknown, max: number): string {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

export function sanitizeSaved(raw: unknown): SavedLook | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  return {
    id: typeof r.id === 'string' && r.id ? r.id.slice(0, 40) : newId(),
    name: cleanText(r.name, 80) || 'Bộ phối chưa đặt tên',
    note: cleanText(r.note, 280),
    look: sanitizeLook(r.look),
    context: sanitizeContext(r.context),
    createdAt: typeof r.createdAt === 'number' && Number.isFinite(r.createdAt) ? r.createdAt : Date.now(),
  };
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(data: string): string {
  const b64 = data.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export interface SharePayload {
  looks: SavedLook[];
}

/** Mã hóa một hoặc nhiều bộ phối (không kèm ảnh cá nhân) thành chuỗi an toàn cho URL. */
export function encodeShare(looks: SavedLook[]): string {
  const compact = looks.map(({ name, note, look, context }) => ({ name, note, look, context }));
  return toBase64Url(JSON.stringify({ v: 1, looks: compact }));
}

export function decodeShare(data: string): SharePayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(data)) as { v?: number; looks?: unknown };
    if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.looks)) return null;
    const looks = parsed.looks
      .slice(0, 12)
      .map(sanitizeSaved)
      .filter((l): l is SavedLook => l !== null);
    return looks.length ? { looks } : null;
  } catch {
    return null;
  }
}

export function shareUrl(looks: SavedLook[], base: string): string {
  const url = new URL(base);
  url.hash = '';
  url.search = '';
  url.searchParams.set('lookbook', encodeShare(looks));
  return url.toString();
}
