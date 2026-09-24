import { useCallback, useEffect, useRef, useState } from 'react';
import { Compare } from './components/Compare';
import { Learn } from './components/Learn';
import { Lookbook, ShareBox } from './components/Lookbook';
import { Principles } from './components/Principles';
import { Studio } from './components/Studio';
import { PRESETS } from './data/presets';
import { buildSuggestedLook } from './lib/recommend';
import { decodeShare, newId, sanitizeContext, sanitizeLook } from './lib/share';
import { loadCurrent, loadLookbook, saveCurrent, saveLookbook } from './lib/storage';
import type { GarmentId, Look, LookContext, SavedLook } from './types';

type Tab = 'phoi-do' | 'so-sanh' | 'lookbook' | 'tim-hieu' | 'nguyen-tac';

const TABS: { id: Tab; label: string }[] = [
  { id: 'phoi-do', label: 'Phối đồ' },
  { id: 'so-sanh', label: 'So sánh' },
  { id: 'lookbook', label: 'Lookbook' },
  { id: 'tim-hieu', label: 'Tìm hiểu' },
  { id: 'nguyen-tac', label: 'Nguyên tắc văn hóa' },
];

function initialTab(): Tab {
  const hash = window.location.hash.replace('#', '');
  return TABS.some((t) => t.id === hash) ? (hash as Tab) : 'phoi-do';
}

function initialShared(): SavedLook[] | null {
  try {
    const token = new URLSearchParams(window.location.search).get('lookbook');
    return token ? (decodeShare(token)?.looks ?? null) : null;
  } catch {
    return null;
  }
}

function initialWork(): { look: Look; ctx: LookContext } {
  const saved = loadCurrent() as { look?: unknown; ctx?: unknown } | null;
  if (saved && saved.look) return { look: sanitizeLook(saved.look), ctx: sanitizeContext(saved.ctx) };
  return { look: PRESETS[0].look, ctx: PRESETS[0].context };
}

const clone = (items: SavedLook[]) => items.map((i) => ({ ...i, id: newId(), createdAt: Date.now() }));

export default function App() {
  const [shared, setShared] = useState<SavedLook[] | null>(initialShared);
  const [tab, setTabState] = useState<Tab>(() => (shared ? 'lookbook' : initialTab()));
  const [work, setWork] = useState(initialWork);
  const [photo, setPhoto] = useState<string | null>(null);
  const [lookbook, setLookbook] = useState<SavedLook[]>(() => loadLookbook() ?? PRESETS.slice(0, 4));
  const [compare, setCompare] = useState<SavedLook[]>([]);
  const [shareTarget, setShareTarget] = useState<SavedLook[] | null>(null);
  const [learnFocus, setLearnFocus] = useState<GarmentId | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const storageWarned = useRef(false);

  const toast = useCallback((message: string) => {
    setToastMsg(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 4200);
  }, []);

  const setTab = (next: Tab) => {
    setTabState(next);
    try {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${next}`);
    } catch {
      // Một số môi trường nhúng không cho đổi URL; bỏ qua.
    }
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    if (!saveLookbook(lookbook) && !storageWarned.current) {
      storageWarned.current = true;
      toast('Trình duyệt không cho lưu dữ liệu; lookbook sẽ mất khi đóng trang. Hãy dùng "Chia sẻ cả lookbook" để giữ lại.');
    }
  }, [lookbook, toast]);

  useEffect(() => saveCurrent({ look: work.look, ctx: work.ctx }), [work]);

  const setLook = (look: Look) => {
    setWork((w) => ({ ...w, look }));
    setShareTarget(null);
  };
  const setCtx = (ctx: LookContext) => setWork((w) => ({ ...w, ctx }));

  const current = (name: string, note = ''): SavedLook => ({
    id: newId(),
    name,
    note,
    look: work.look,
    context: work.ctx,
    createdAt: Date.now(),
  });

  const openItem = (item: SavedLook) => {
    setWork({ look: item.look, ctx: item.context });
    setShareTarget(null);
    setTab('phoi-do');
    toast(`Đang chỉnh "${item.name}". Lưu lại để giữ thay đổi.`);
  };

  const addCompare = (item: SavedLook) => {
    if (compare.length >= 3) {
      toast('Đã có 3 phương án. Bỏ bớt một phương án trong trang So sánh trước khi thêm.');
      return;
    }
    setCompare([...compare, { ...item, id: newId() }]);
    toast(`Đã thêm vào so sánh (${compare.length + 1}/3).`);
  };

  const clearSharedQuery = () => {
    setShared(null);
    try {
      history.replaceState(null, '', `${window.location.pathname}#lookbook`);
    } catch {
      // bỏ qua
    }
  };

  const importLooks = (items: SavedLook[]) => {
    setLookbook((prev) => [...clone(items), ...prev]);
    clearSharedQuery();
    toast(`Đã thêm ${items.length} bộ phối vào lookbook.`);
  };

  const addPresets = () => {
    const have = new Set(lookbook.map((l) => l.name));
    const missing = PRESETS.filter((p) => !have.has(p.name));
    if (!missing.length) {
      toast('Lookbook đã có đủ các bộ mẫu.');
      return;
    }
    setLookbook([...lookbook, ...clone(missing)]);
    toast(`Đã thêm ${missing.length} bộ phối mẫu.`);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <path d="M16 3 L25 9 L22 29 L10 29 L7 9 Z" fill="currentColor" opacity="0.18" />
              <path d="M11 6 Q16 11 21 6 M16 10 L16 29 M7 9 L3 20 M25 9 L29 20" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <strong>Việt phục Remix</strong>
            <span>Phối trang phục truyền thống theo phong cách Gen Z</span>
          </div>
        </div>
        <nav className="tabs" aria-label="Chức năng">
          {TABS.map((t) => (
            <button key={t.id} type="button" className={`tab${tab === t.id ? ' is-active' : ''}`} aria-current={tab === t.id ? 'page' : undefined} onClick={() => setTab(t.id)}>
              {t.label}
              {t.id === 'so-sanh' && compare.length > 0 && <span className="badge num">{compare.length}</span>}
              {t.id === 'lookbook' && lookbook.length > 0 && <span className="badge num">{lookbook.length}</span>}
            </button>
          ))}
        </nav>
      </header>

      <main className="main">
        {tab === 'phoi-do' && (
          <Studio
            look={work.look}
            setLook={setLook}
            ctx={work.ctx}
            setCtx={setCtx}
            photo={photo}
            setPhoto={setPhoto}
            toast={toast}
            onSave={(name, note) => {
              setLookbook([current(name, note), ...lookbook]);
              toast(`Đã lưu "${name}" vào lookbook.`);
            }}
            onCompare={(name) => addCompare(current(name))}
            onShare={(name, note) => setShareTarget([current(name, note)])}
            onLearn={(g) => {
              setLearnFocus(g);
              setTab('tim-hieu');
            }}
            shareBox={shareTarget && <ShareBox looks={shareTarget} onClose={() => setShareTarget(null)} />}
          />
        )}
        {tab === 'so-sanh' && (
          <Compare items={compare} onOpen={openItem} onRemove={(id) => setCompare(compare.filter((c) => c.id !== id))} onGoStudio={() => setTab('phoi-do')} />
        )}
        {tab === 'lookbook' && (
          <Lookbook
            looks={lookbook}
            shared={shared}
            onOpen={openItem}
            onCompare={addCompare}
            onDelete={(id) => setLookbook(lookbook.filter((l) => l.id !== id))}
            onUpdate={(id, p) => setLookbook(lookbook.map((l) => (l.id === id ? { ...l, ...p } : l)))}
            onImport={importLooks}
            onDismissShared={clearSharedQuery}
            onAddPresets={addPresets}
            toast={toast}
          />
        )}
        {tab === 'tim-hieu' && (
          <Learn
            focus={learnFocus}
            onTry={(g) => {
              setLook(buildSuggestedLook(g, work.ctx, work.look.style, work.look.avatar));
              setTab('phoi-do');
            }}
          />
        )}
        {tab === 'nguyen-tac' && <Principles />}
      </main>

      <footer className="footer">
        Hình minh họa mang tính gợi ý. Nội dung văn hóa được tổng hợp từ tư liệu có ghi nguồn; hãy góp ý trong mục Nguyên tắc văn hóa nếu bạn thấy điều chưa chính xác.
      </footer>

      <div className="toast" role="status" aria-live="polite" hidden={!toastMsg}>
        {toastMsg}
      </div>
    </div>
  );
}
