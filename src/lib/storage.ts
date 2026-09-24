import type { SavedLook } from '../types';
import { sanitizeSaved } from './share';

const KEY = 'viet-phuc-remix:lookbook:v1';

/** Trả về null khi người dùng chưa từng lưu lookbook (lần đầu mở ứng dụng). */
export function loadLookbook(): SavedLook[] | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeSaved).filter((l): l is SavedLook => l !== null);
  } catch {
    return [];
  }
}

/** Trả về false nếu trình duyệt không cho lưu (chế độ ẩn danh, bộ nhớ đầy...). */
export function saveLookbook(looks: SavedLook[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(looks));
    return true;
  } catch {
    return false;
  }
}

const CURRENT_KEY = 'viet-phuc-remix:current:v1';

export function loadCurrent(): unknown {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCurrent(value: unknown): void {
  try {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(value));
  } catch {
    // Không lưu được thì bỏ qua: đây chỉ là tiện ích nhớ bộ phối đang dở.
  }
}
