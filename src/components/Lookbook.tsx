import { useState } from 'react';
import { EVENT_BY_ID, REGION_BY_ID, WEATHER_BY_ID } from '../data/catalog';
import { overallScore } from '../lib/rules';
import { decodeShare, encodeShare, shareUrl } from '../lib/share';
import type { SavedLook } from '../types';
import { Mockup } from './Mockup';

interface Props {
  looks: SavedLook[];
  shared: SavedLook[] | null;
  onOpen: (item: SavedLook) => void;
  onCompare: (item: SavedLook) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Pick<SavedLook, 'name' | 'note'>) => void;
  onImport: (items: SavedLook[]) => void;
  onDismissShared: () => void;
  onAddPresets: () => void;
  toast: (message: string) => void;
}

function contextLabel(item: SavedLook): string {
  const parts = [
    item.context.event && EVENT_BY_ID[item.context.event].name,
    item.context.region && REGION_BY_ID[item.context.region].name,
    item.context.weather && WEATHER_BY_ID[item.context.weather].name,
  ].filter(Boolean);
  return parts.length ? parts.join(' · ') : 'Không có bối cảnh';
}

/** Bản đóng gói một file (chạy nhúng, không có địa chỉ riêng) chỉ chia sẻ bằng mã. */
const SINGLE_FILE = import.meta.env.MODE === 'single';

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function ShareBox({ looks, onClose }: { looks: SavedLook[]; onClose: () => void }) {
  const url = shareUrl(looks, window.location.href);
  const code = encodeShare(looks);
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (label: string, text: string, inputId: string) => {
    if (await copyText(text)) setCopied(label);
    else {
      const el = document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement | null;
      el?.select();
      setCopied(`${label} đã được chọn, nhấn Ctrl+C (hoặc giữ để sao chép)`);
    }
  };
  return (
    <div className="share-box" role="region" aria-label="Chia sẻ">
      <div className="share-head">
        <strong>Chia sẻ {looks.length > 1 ? `${looks.length} bộ phối` : `"${looks[0].name}"`}</strong>
        <button type="button" className="btn btn-ghost btn-small" onClick={onClose}>
          Đóng
        </button>
      </div>
      {!SINGLE_FILE && (
        <>
          <label htmlFor="link-chia-se">Link (mở trên máy khác để xem lại bộ phối)</label>
          <div className="share-line">
            <input id="link-chia-se" readOnly value={url} onFocus={(e) => e.target.select()} />
            <button type="button" className="btn btn-small" onClick={() => copy('Link', url, 'link-chia-se')}>
              Sao chép link
            </button>
          </div>
        </>
      )}
      <label htmlFor="ma-chia-se">Mã lookbook (dán vào ô "Nhập mã" trong trang Lookbook)</label>
      <div className="share-line">
        <textarea id="ma-chia-se" readOnly value={code} rows={2} onFocus={(e) => e.target.select()} />
        <button type="button" className="btn btn-small" onClick={() => copy('Mã', code, 'ma-chia-se')}>
          Sao chép mã
        </button>
      </div>
      {copied && <p className="field-hint" role="status">{copied.includes('chọn') ? copied : `${copied} đã được sao chép.`}</p>}
      <p className="field-hint">Link và mã không chứa ảnh chân dung của bạn.</p>
    </div>
  );
}

export function Lookbook({ looks, shared, onOpen, onCompare, onDelete, onUpdate, onImport, onDismissShared, onAddPresets, toast }: Props) {
  const [sharing, setSharing] = useState(false);
  const [code, setCode] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const importCode = () => {
    const raw = code.trim();
    const token = raw.includes('lookbook=') ? new URL(raw, window.location.href).searchParams.get('lookbook') ?? '' : raw;
    const payload = decodeShare(token);
    if (!payload) {
      toast('Mã không hợp lệ. Hãy dán nguyên đoạn mã hoặc link chia sẻ.');
      return;
    }
    onImport(payload.looks);
    setCode('');
  };

  return (
    <div className="lookbook">
      {shared && (
        <section className="banner">
          <div>
            <strong>Lookbook được chia sẻ với bạn ({shared.length} bộ)</strong>
            <p>{shared.map((s) => s.name).join(' · ')}</p>
          </div>
          <div className="chip-row">
            <button type="button" className="btn btn-primary btn-small" onClick={() => onImport(shared)}>
              Lưu vào lookbook của tôi
            </button>
            <button type="button" className="btn btn-ghost btn-small" onClick={onDismissShared}>
              Bỏ qua
            </button>
          </div>
        </section>
      )}

      <div className="lookbook-tools">
        <p className="page-intro">
          {looks.length ? `${looks.length} bộ phối đã lưu trên trình duyệt này.` : 'Lookbook đang trống.'} Lookbook lưu trong trình duyệt của bạn; dùng link hoặc mã để chuyển sang máy khác.
        </p>
        <div className="chip-row">
          <button type="button" className="btn" onClick={() => setSharing(true)} disabled={!looks.length}>
            Chia sẻ cả lookbook
          </button>
          <button type="button" className="btn btn-ghost" onClick={onAddPresets}>
            Thêm 7 bộ phối mẫu
          </button>
        </div>
        <form
          className="import-form"
          onSubmit={(e) => {
            e.preventDefault();
            importCode();
          }}
        >
          <label htmlFor="nhap-ma">Nhập mã hoặc link lookbook</label>
          <div className="share-line">
            <input id="nhap-ma" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Dán mã hoặc link tại đây" />
            <button type="submit" className="btn btn-small" disabled={!code.trim()}>
              Nhập
            </button>
          </div>
        </form>
        {sharing && looks.length > 0 && <ShareBox looks={looks} onClose={() => setSharing(false)} />}
      </div>

      {looks.length === 0 ? (
        <div className="empty">
          <h2>Chưa có bộ phối nào</h2>
          <p>Lưu bộ phối từ phòng phối đồ, hoặc thêm các bộ mẫu để xem lookbook trông thế nào.</p>
        </div>
      ) : (
        <div className="look-grid">
          {looks.map((item) => (
            <article className="look-card" key={item.id}>
              <button type="button" className="look-thumb" onClick={() => onOpen(item)} aria-label={`Mở ${item.name} trong phòng phối đồ`}>
                <Mockup look={item.look} title={item.name} />
              </button>
              <div className="look-body">
                <label className="sr-only" htmlFor={`ten-${item.id}`}>
                  Tên bộ phối
                </label>
                <input
                  id={`ten-${item.id}`}
                  className="look-name"
                  value={item.name}
                  maxLength={80}
                  onChange={(e) => onUpdate(item.id, { name: e.target.value, note: item.note })}
                />
                <p className="meta">
                  {contextLabel(item)} · <span className="num">{overallScore(item.look, item.context)}</span> điểm
                </p>
                <label className="sr-only" htmlFor={`ghi-chu-${item.id}`}>
                  Ghi chú
                </label>
                <textarea
                  id={`ghi-chu-${item.id}`}
                  className="look-note"
                  value={item.note}
                  maxLength={280}
                  rows={2}
                  placeholder="Thêm ghi chú"
                  onChange={(e) => onUpdate(item.id, { name: item.name, note: e.target.value })}
                />
                <div className="chip-row">
                  <button type="button" className="btn btn-small" onClick={() => onOpen(item)}>
                    Mở
                  </button>
                  <button type="button" className="btn btn-ghost btn-small" onClick={() => onCompare(item)}>
                    So sánh
                  </button>
                  {confirmDelete === item.id ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => {
                          onDelete(item.id);
                          setConfirmDelete(null);
                        }}
                      >
                        Xóa hẳn
                      </button>
                      <button type="button" className="btn btn-ghost btn-small" onClick={() => setConfirmDelete(null)}>
                        Giữ lại
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-ghost btn-small" onClick={() => setConfirmDelete(item.id)}>
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
