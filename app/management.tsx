"use client";

import { useState } from "react";

export type PostStatus = "Bản nháp" | "Đã đăng" | "Đã ẩn";
export type ClubPost = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  status: PostStatus;
  views: number;
};

export type ActivityStatus = "Bản nháp" | "Mở đăng ký" | "Đã đóng" | "Đã kết thúc";
export type ClubActivity = {
  id: number;
  title: string;
  kind: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered: number;
  description: string;
  status: ActivityStatus;
  joined: boolean;
  checkedIn: boolean;
};

export const seedPosts: ClubPost[] = [
  { id: 1, title: "Mở đơn tuyển thành viên mùa thu 2026", excerpt: "CLB chào đón những bạn yêu công nghệ, sáng tạo và muốn cùng xây dựng các dự án có ích cho cộng đồng sinh viên.", category: "Tuyển thành viên", author: "Minh Anh", date: "16/11/2026", status: "Đã đăng", views: 248 },
  { id: 2, title: "Recap workshop: Từ ý tưởng đến sản phẩm", excerpt: "Nhìn lại buổi workshop cuối tuần với những câu chuyện về thiết kế, lập trình và làm việc nhóm.", category: "Tin tức", author: "Quang Huy", date: "14/11/2026", status: "Đã đăng", views: 186 },
  { id: 3, title: "Giới thiệu chuỗi chia sẻ AI thực hành", excerpt: "Bản nháp nội dung giới thiệu chuỗi hoạt động dành cho thành viên mới.", category: "Hoạt động", author: "Gia Bảo", date: "12/11/2026", status: "Bản nháp", views: 0 },
];

export const seedActivities: ClubActivity[] = [
  { id: 1, title: "Workshop: Xây ứng dụng AI đầu tiên", kind: "Workshop", date: "22/11/2026", time: "09:00 – 11:30", location: "Phòng B202 · Tòa B", capacity: 50, registered: 32, description: "Thực hành từ ý tưởng đến bản demo. Mang theo laptop và tinh thần thử nghiệm.", status: "Mở đăng ký", joined: false, checkedIn: false },
  { id: 2, title: "Sinh hoạt CLB tháng 11", kind: "Sinh hoạt", date: "25/11/2026", time: "18:30 – 20:00", location: "Hội trường A1", capacity: 100, registered: 61, description: "Gặp gỡ các thành viên, cập nhật hoạt động và chia sẻ kế hoạch tháng tới.", status: "Mở đăng ký", joined: false, checkedIn: false },
  { id: 3, title: "Hackday: Ý tưởng cho campus", kind: "Dự án", date: "30/11/2026", time: "08:00 – 17:00", location: "Không gian sáng tạo", capacity: 40, registered: 0, description: "Một ngày cùng lên ý tưởng và làm thử giải pháp cho cuộc sống sinh viên.", status: "Bản nháp", joined: false, checkedIn: false },
];

const postCategories = ["Tin tức", "Hoạt động", "Tuyển thành viên", "Thông báo"];
const activityKinds = ["Workshop", "Sinh hoạt", "Dự án", "Tình nguyện"];

function Badge({ label }: { label: string }) {
  const tone = label === "Đã đăng" || label === "Mở đăng ký" ? "green" : label === "Đã ẩn" || label === "Đã đóng" ? "amber" : "neutral";
  return <span className={`management-badge management-badge-${tone}`}>{label}</span>;
}

function Stat({ label, number, caption }: { label: string; number: number; caption: string }) {
  return <div className="management-stat"><span>{label}</span><strong>{String(number).padStart(2, "0")}</strong><small>{caption}</small></div>;
}

export function PostManagement({ posts, setPosts, clubName, notify }: {
  posts: ClubPost[];
  setPosts: React.Dispatch<React.SetStateAction<ClubPost[]>>;
  clubName: string;
  notify: (message: string) => void;
}) {
  const [filter, setFilter] = useState("Tất cả");
  const [selectedId, setSelectedId] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Tin tức");
  const selected = posts.find((post) => post.id === selectedId) ?? posts[0];
  const visible = filter === "Tất cả" ? posts : posts.filter((post) => post.status === filter);

  const openNew = () => { setEditingId(null); setTitle(""); setExcerpt(""); setCategory("Tin tức"); setFormOpen(true); };
  const openEdit = (post: ClubPost) => { setEditingId(post.id); setTitle(post.title); setExcerpt(post.excerpt); setCategory(post.category); setFormOpen(true); };
  const save = (status: PostStatus) => {
    if (!title.trim() || !excerpt.trim()) return;
    if (editingId !== null) {
      setPosts((items) => items.map((post) => post.id === editingId ? { ...post, title: title.trim(), excerpt: excerpt.trim(), category, status } : post));
      setSelectedId(editingId);
    } else {
      const id = Date.now();
      setPosts((items) => [{ id, title: title.trim(), excerpt: excerpt.trim(), category, author: "Bạn", date: "17/11/2026", status, views: 0 }, ...items]);
      setSelectedId(id);
    }
    setFilter("Tất cả");
    setFormOpen(false);
    notify(status === "Đã đăng" ? "Đã đăng bài viết mẫu" : "Đã lưu bản nháp");
  };
  const changeStatus = (post: ClubPost, status: PostStatus) => { setPosts((items) => items.map((item) => item.id === post.id ? { ...item, status } : item)); notify(`Đã chuyển bài đăng sang: ${status}`); };

  return <div className="page-scroll"><div className="page-wrap management-page">
    <div className="eyebrow">NỘI DUNG / QUẢN LÝ BÀI ĐĂNG</div>
    <div className="page-header"><div><h1>Quản lý bài đăng</h1><p>Soạn, xuất bản và theo dõi nội dung của {clubName}.</p></div><button className="button button-primary" onClick={openNew}>＋ Tạo bài đăng</button></div>
    <div className="management-stats"><Stat label="TỔNG BÀI ĐĂNG" number={posts.length} caption="Trong không gian CLB"/><Stat label="ĐÃ ĐĂNG" number={posts.filter((p) => p.status === "Đã đăng").length} caption="Thành viên có thể xem"/><Stat label="BẢN NHÁP" number={posts.filter((p) => p.status === "Bản nháp").length} caption="Đang biên tập"/></div>
    {formOpen ? <section className="card management-editor"><div className="management-editor-head"><div><h2>{editingId === null ? "Tạo bài đăng mới" : "Chỉnh sửa bài đăng"}</h2><p>Nội dung mẫu sẽ chỉ tồn tại trong phiên xem thử này.</p></div><button className="button button-outline" onClick={() => setFormOpen(false)}>Đóng</button></div><div className="management-form"><label>Tiêu đề<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề bài đăng" maxLength={100}/></label><label>Chuyên mục<select value={category} onChange={(e) => setCategory(e.target.value)}>{postCategories.map((item) => <option key={item}>{item}</option>)}</select></label><label className="management-full">Nội dung<textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Viết nội dung bài đăng..." rows={6}/></label></div><div className="management-editor-actions"><button className="button button-outline" disabled={!title.trim() || !excerpt.trim()} onClick={() => save("Bản nháp")}>Lưu nháp</button><button className="button button-primary" disabled={!title.trim() || !excerpt.trim()} onClick={() => save("Đã đăng")}>Đăng bài →</button></div></section> : <div className="management-workspace"><section className="card management-list"><div className="management-list-heading"><h2>Danh sách bài đăng</h2><span>{visible.length} bài</span></div><div className="management-filters">{["Tất cả", "Đã đăng", "Bản nháp", "Đã ẩn"].map((item) => <button key={item} className={filter === item ? "management-filter-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>{visible.length === 0 ? <p className="management-empty">Chưa có bài đăng ở trạng thái này.</p> : visible.map((post) => <button className={`management-item ${selected.id === post.id ? "management-item-active" : ""}`} key={post.id} onClick={() => setSelectedId(post.id)}><span className="management-item-icon">✎</span><span className="management-item-copy"><strong>{post.title}</strong><small>{post.category} · {post.date}</small></span><Badge label={post.status}/></button>)}</section><section className="card management-detail"><div className="management-detail-top"><span>CHẾ ĐỘ XEM TRƯỚC</span><Badge label={selected.status}/></div><div className="post-cover"><span>{selected.category.toUpperCase()}</span><div className="post-cover-orbit"/></div><div className="management-detail-body"><h2>{selected.title}</h2><div className="management-byline">{selected.author} · {selected.date} · {selected.views} lượt xem mẫu</div><p>{selected.excerpt}</p><div className="management-detail-actions"><button className="button button-outline" onClick={() => openEdit(selected)}>Chỉnh sửa</button>{selected.status === "Bản nháp" ? <button className="button button-primary" onClick={() => changeStatus(selected, "Đã đăng")}>Đăng bài</button> : selected.status === "Đã đăng" ? <button className="button button-outline" onClick={() => changeStatus(selected, "Đã ẩn")}>Ẩn bài</button> : <button className="button button-primary" onClick={() => changeStatus(selected, "Đã đăng")}>Đăng lại</button>}</div></div></section></div>}
  </div></div>;
}

export function ActivityManagement({ activities, setActivities, clubName, notify }: {
  activities: ClubActivity[];
  setActivities: React.Dispatch<React.SetStateAction<ClubActivity[]>>;
  clubName: string;
  notify: (message: string) => void;
}) {
  const [filter, setFilter] = useState("Tất cả");
  const [selectedId, setSelectedId] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("Workshop");
  const [date, setDate] = useState("2026-11-22");
  const [time, setTime] = useState("09:00 – 11:30");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("50");
  const [description, setDescription] = useState("");
  const selected = activities.find((activity) => activity.id === selectedId) ?? activities[0];
  const visible = filter === "Tất cả" ? activities : activities.filter((activity) => activity.status === filter);

  const openNew = () => { setEditingId(null); setTitle(""); setKind("Workshop"); setDate("2026-11-22"); setTime("09:00 – 11:30"); setLocation(""); setCapacity("50"); setDescription(""); setFormOpen(true); };
  const openEdit = (activity: ClubActivity) => { setEditingId(activity.id); setTitle(activity.title); setKind(activity.kind); setDate(activity.date.split("/").reverse().join("-")); setTime(activity.time); setLocation(activity.location); setCapacity(String(activity.capacity)); setDescription(activity.description); setFormOpen(true); };
  const save = (status: ActivityStatus) => {
    if (!title.trim() || !date || !time.trim() || !location.trim() || !description.trim() || Number(capacity) < 1) return;
    const displayDate = date.split("-").reverse().join("/");
    if (editingId !== null) {
      setActivities((items) => items.map((activity) => activity.id === editingId ? { ...activity, title: title.trim(), kind, date: displayDate, time: time.trim(), location: location.trim(), capacity: Number(capacity), description: description.trim(), status } : activity));
      setSelectedId(editingId);
    } else {
      const id = Date.now();
      setActivities((items) => [{ id, title: title.trim(), kind, date: displayDate, time: time.trim(), location: location.trim(), capacity: Number(capacity), description: description.trim(), registered: 0, status, joined: false, checkedIn: false }, ...items]);
      setSelectedId(id);
    }
    setFilter("Tất cả");
    setFormOpen(false);
    notify(status === "Mở đăng ký" ? "Đã mở đăng ký hoạt động mẫu" : "Đã lưu hoạt động nháp");
  };
  const changeStatus = (activity: ClubActivity, status: ActivityStatus) => { setActivities((items) => items.map((item) => item.id === activity.id ? { ...item, status } : item)); notify(`Đã chuyển hoạt động sang: ${status}`); };
  const toggleJoin = (activity: ClubActivity) => {
    if (activity.status !== "Mở đăng ký" || (!activity.joined && activity.registered >= activity.capacity)) return;
    setActivities((items) => items.map((item) => item.id === activity.id ? { ...item, joined: !item.joined, checkedIn: false, registered: item.registered + (item.joined ? -1 : 1) } : item));
    notify(activity.joined ? "Đã hủy đăng ký mẫu" : "Đã đăng ký tham gia mẫu");
  };
  const checkIn = (activity: ClubActivity) => { setActivities((items) => items.map((item) => item.id === activity.id ? { ...item, checkedIn: !item.checkedIn } : item)); notify(activity.checkedIn ? "Đã bỏ điểm danh mẫu" : "Đã điểm danh mẫu"); };

  return <div className="page-scroll"><div className="page-wrap management-page">
    <div className="eyebrow">SỰ KIỆN / QUẢN LÝ HOẠT ĐỘNG</div>
    <div className="page-header"><div><h1>Quản lý hoạt động</h1><p>Lên kế hoạch, mở đăng ký và điểm danh hoạt động của {clubName}.</p></div><button className="button button-primary" onClick={openNew}>＋ Tạo hoạt động</button></div>
    <div className="management-stats"><Stat label="TỔNG HOẠT ĐỘNG" number={activities.length} caption="Trong đợt hiện tại"/><Stat label="ĐANG MỞ ĐĂNG KÝ" number={activities.filter((a) => a.status === "Mở đăng ký").length} caption="Thành viên có thể tham gia"/><Stat label="LƯỢT ĐĂNG KÝ" number={activities.reduce((sum, a) => sum + a.registered, 0)} caption="Trên tất cả hoạt động"/></div>
    {formOpen ? <section className="card management-editor"><div className="management-editor-head"><div><h2>{editingId === null ? "Tạo hoạt động mới" : "Chỉnh sửa hoạt động"}</h2><p>Điền thông tin để thành viên biết thời gian và cách tham gia.</p></div><button className="button button-outline" onClick={() => setFormOpen(false)}>Đóng</button></div><div className="management-form"><label className="management-full">Tên hoạt động<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ví dụ: Workshop thiết kế sản phẩm" maxLength={100}/></label><label>Loại hoạt động<select value={kind} onChange={(e) => setKind(e.target.value)}>{activityKinds.map((item) => <option key={item}>{item}</option>)}</select></label><label>Ngày diễn ra<input type="date" value={date} onChange={(e) => setDate(e.target.value)}/></label><label>Giờ diễn ra<input value={time} onChange={(e) => setTime(e.target.value)} placeholder="09:00 – 11:30"/></label><label>Địa điểm<input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Phòng B202"/></label><label>Số chỗ<input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)}/></label><label className="management-full">Mô tả<textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Nội dung và lưu ý cho người tham gia..."/></label></div><div className="management-editor-actions"><button className="button button-outline" disabled={!title.trim() || !date || !location.trim() || !description.trim() || Number(capacity) < 1} onClick={() => save("Bản nháp")}>Lưu nháp</button><button className="button button-primary" disabled={!title.trim() || !date || !location.trim() || !description.trim() || Number(capacity) < 1} onClick={() => save("Mở đăng ký")}>Mở đăng ký →</button></div></section> : <div className="management-workspace"><section className="card management-list"><div className="management-list-heading"><h2>Danh sách hoạt động</h2><span>{visible.length} hoạt động</span></div><div className="management-filters">{["Tất cả", "Mở đăng ký", "Bản nháp", "Đã đóng", "Đã kết thúc"].map((item) => <button key={item} className={filter === item ? "management-filter-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>{visible.length === 0 ? <p className="management-empty">Chưa có hoạt động ở trạng thái này.</p> : visible.map((activity) => <button className={`management-item ${selected.id === activity.id ? "management-item-active" : ""}`} key={activity.id} onClick={() => setSelectedId(activity.id)}><span className="management-date"><strong>{activity.date.slice(0, 2)}</strong><small>TH11</small></span><span className="management-item-copy"><strong>{activity.title}</strong><small>{activity.kind} · {activity.date}</small></span><Badge label={activity.status}/></button>)}</section><section className="card management-detail activity-detail"><div className="management-detail-top"><span>CHI TIẾT HOẠT ĐỘNG</span><Badge label={selected.status}/></div><div className="activity-art"><span>{selected.kind.toUpperCase()}</span><strong>{selected.date.slice(0, 2)}</strong><small>THÁNG 11</small></div><div className="management-detail-body"><h2>{selected.title}</h2><p>{selected.description}</p><div className="activity-facts"><span>◷ &nbsp; {selected.date} · {selected.time}</span><span>⌖ &nbsp; {selected.location}</span><span>♙ &nbsp; {selected.registered}/{selected.capacity} người đăng ký</span></div><div className="activity-progress"><span style={{ width: `${Math.min(100, selected.registered / selected.capacity * 100)}%` }}/></div><div className="management-detail-actions"><button className="button button-outline" onClick={() => openEdit(selected)}>Chỉnh sửa</button>{selected.status === "Bản nháp" && <button className="button button-primary" onClick={() => changeStatus(selected, "Mở đăng ký")}>Mở đăng ký</button>}{selected.status === "Mở đăng ký" && <><button className="button button-primary" onClick={() => toggleJoin(selected)}>{selected.joined ? "Hủy đăng ký của tôi" : selected.registered >= selected.capacity ? "Đã đủ chỗ" : "Thử đăng ký"}</button><button className="button button-outline" onClick={() => changeStatus(selected, "Đã đóng")}>Đóng đăng ký</button></>}{selected.status === "Đã đóng" && <><button className="button button-outline" onClick={() => changeStatus(selected, "Mở đăng ký")}>Mở lại</button><button className="button button-primary" onClick={() => changeStatus(selected, "Đã kết thúc")}>Kết thúc hoạt động</button></>}{selected.joined && selected.status !== "Bản nháp" && <button className="button button-outline" onClick={() => checkIn(selected)}>{selected.checkedIn ? "Đã điểm danh ✓" : "Thử điểm danh"}</button>}</div></div></section></div>}
  </div></div>;
}
