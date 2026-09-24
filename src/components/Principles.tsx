import { useState } from 'react';
import { GARMENTS } from '../data/garments';
import { copyText } from './Lookbook';

const REPO_ISSUES = 'https://github.com/Min23-tech/Project-Vi-t-ph-c/issues/new';

const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: 'Có nguồn và nhãn độ tin cậy',
    body: 'Mỗi thông tin về nguồn gốc, ý nghĩa đều ghi rõ là "Có tư liệu", "Cách hiểu phổ biến" hay "Còn tranh luận", kèm danh sách nguồn tham khảo (sử liệu, sách khảo cứu, bảo tàng, hồ sơ UNESCO).',
  },
  {
    title: 'Gọi đúng tên mức biến tấu',
    body: 'Mỗi bộ phối được gắn nhãn Truyền thống, Cách tân nhẹ, Remix hoặc Remix mạnh. Người dùng được sáng tạo tự do, nhưng hình ảnh chia sẻ không bị nhầm là tư liệu lịch sử.',
  },
  {
    title: 'Cảnh báo giải thích, không cấm đoán',
    body: 'Cảnh báo chia 3 mức: Cần sửa (làm mất cấu trúc trang phục), Lưu ý (dễ gây phản cảm hoặc sai ngữ cảnh), Gợi ý (thông tin thêm). Mỗi cảnh báo nêu lý do và cách sửa.',
  },
  {
    title: 'Tôn trọng trang phục nghi lễ, cung đình',
    body: 'Áo Nhật Bình, hoa văn rồng, trang phục đi lễ chùa được kiểm tra chặt hơn vì mang ý nghĩa tôn ti, tâm linh.',
  },
  {
    title: 'Không gán sai vùng miền',
    body: 'Mỗi trang phục và phụ kiện được gắn vùng văn hóa. Phối lẫn vùng miền vẫn được phép nhưng sẽ được ghi chú để người xem hiểu đó là remix.',
  },
  {
    title: 'Phạm vi rõ ràng',
    body: 'Phiên bản này tập trung vào 5 kiểu áo của người Việt (Kinh). Trang phục của các dân tộc thiểu số chưa được đưa vào; chúng chỉ nên được bổ sung khi có sự tham gia của cộng đồng và nhà nghiên cứu, để tránh trình bày sai.',
  },
  {
    title: 'Quyền riêng tư',
    body: 'Ảnh chân dung chỉ được xử lý trên máy người dùng, không gửi lên máy chủ và không nằm trong link chia sẻ.',
  },
];

const RULES: [string, string][] = [
  ['Cần sửa', 'Áo dài, áo ngũ thân, áo tứ thân, áo Nhật Bình phối với váy ngắn.'],
  ['Cần sửa', 'Bộ phối thấp hơn độ trang trọng của dịp từ 2 bậc trở lên (ví dụ áo bà ba với jeans khi dự cưới).'],
  ['Lưu ý', 'Bộ phối thấp hơn độ trang trọng của dịp 1 bậc.'],
  ['Lưu ý', 'Áo Nhật Bình phối đồ đường phố; hoa văn rồng trên áo Nhật Bình.'],
  ['Lưu ý', 'Áo trắng hoặc đen làm màu chủ đạo ngày Tết; trùng màu đỏ của cô dâu; toàn trắng khi dự cưới.'],
  ['Lưu ý', 'Áo dài phối jeans trong dịp trang trọng; phong cách đường phố khi đi lễ chùa.'],
  ['Lưu ý', 'Vải dày khi trời nóng; lụa tơ tằm, guốc gỗ khi trời mưa; màu sắc dễ chỏi.'],
  ['Gợi ý', 'Pha trộn phụ kiện khác vùng miền; áo tứ thân mặc với quần; váy đụp với áo khác.'],
  ['Gợi ý', 'Trang phục theo truyền thống dành cho nữ được mặc bởi nam; đồng phục học sinh không phải màu trắng.'],
];

export function Principles() {
  const [topic, setTopic] = useState('Chung');
  const [detail, setDetail] = useState('');
  const [source, setSource] = useState('');
  const [copied, setCopied] = useState(false);

  const title = `[Góp ý nội dung] ${topic}`;
  const body = `**Nội dung cần xem lại:**\n${detail || '(mô tả)'}\n\n**Nguồn đề xuất:**\n${source || '(nếu có)'}\n`;
  const issueUrl = `${REPO_ISSUES}?${new URLSearchParams({ title, body }).toString()}`;

  return (
    <div className="principles">
      <p className="page-intro">
        Cách Việt phục Remix bảo đảm thông tin văn hóa được thể hiện phù hợp, và cách bạn góp ý khi thấy điều chưa đúng.
      </p>
      <div className="principle-grid">
        {PRINCIPLES.map((p) => (
          <section key={p.title} className="card">
            <h2 className="card-title">{p.title}</h2>
            <p>{p.body}</p>
          </section>
        ))}
      </div>

      <section className="card">
        <h2 className="card-title">Các quy tắc kiểm tra đang áp dụng</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Mức</th>
                <th scope="col">Trường hợp</th>
              </tr>
            </thead>
            <tbody>
              {RULES.map(([level, text]) => (
                <tr key={text}>
                  <td>
                    <span className={`pill pill-${level === 'Cần sửa' ? 'nghiem-trong' : level === 'Lưu ý' ? 'luu-y' : 'goi-y'}`}>{level}</span>
                  </td>
                  <td>{text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Quy trình duyệt nội dung</h2>
        <ol className="plain-list numbered">
          <li>Soạn nội dung từ sử liệu, sách khảo cứu và tư liệu bảo tàng; ghi nguồn cho từng mục.</li>
          <li>Gắn nhãn độ tin cậy; ý nghĩa biểu tượng chưa có ghi chép được ghi là "cách hiểu phổ biến".</li>
          <li>Mời người có chuyên môn (giảng viên văn hóa học, cán bộ bảo tàng, nghệ nhân) đọc duyệt trước khi phát hành.</li>
          <li>Tiếp nhận góp ý của người dùng qua biểu mẫu bên dưới, xem xét công khai và cập nhật dữ liệu.</li>
        </ol>
      </section>

      <section className="card">
        <h2 className="card-title">Góp ý nội dung</h2>
        <form className="report-form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="gop-y-chu-de">Chủ đề</label>
          <select id="gop-y-chu-de" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option>Chung</option>
            {GARMENTS.map((g) => (
              <option key={g.id}>{g.name}</option>
            ))}
            <option>Phụ kiện</option>
            <option>Quy tắc cảnh báo</option>
          </select>
          <label htmlFor="gop-y-noi-dung">Thông tin nào chưa đúng hoặc cần bổ sung?</label>
          <textarea id="gop-y-noi-dung" rows={4} value={detail} onChange={(e) => setDetail(e.target.value)} />
          <label htmlFor="gop-y-nguon">Nguồn tham khảo (sách, bảo tàng, đường dẫn)</label>
          <input id="gop-y-nguon" value={source} onChange={(e) => setSource(e.target.value)} />
          <div className="chip-row">
            <a className={`btn btn-primary${detail.trim() ? '' : ' is-disabled'}`} href={detail.trim() ? issueUrl : undefined} target="_blank" rel="noreferrer" aria-disabled={!detail.trim()}>
              Gửi góp ý qua GitHub
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!detail.trim()}
              onClick={async () => setCopied(await copyText(`${title}\n\n${body}`))}
            >
              Sao chép nội dung góp ý
            </button>
          </div>
          <p className="field-hint">
            Nút gửi mở trang tạo issue trên GitHub của dự án với nội dung đã điền sẵn; bạn cần tài khoản GitHub để gửi.
            {copied && ' Đã sao chép nội dung.'}
          </p>
        </form>
      </section>
    </div>
  );
}
