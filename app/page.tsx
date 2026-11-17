"use client";

import { useState } from "react";
import { ActivityManagement, PostManagement, seedActivities, seedPosts, type ClubActivity, type ClubPost } from "./management";

type View = "chat" | "voice" | "meetings" | "posts" | "activities" | "recruitment" | "applications" | "interviews" | "profile";
type ApplicationStatus = "Mới nộp" | "Đang xét duyệt" | "Chờ phỏng vấn" | "Trúng tuyển" | "Chưa phù hợp";
type Application = { id: number; name: string; initials: string; department: string; submitted: string; status: ApplicationStatus; note: string };
type Message = { id: number; name: string; initials: string; time: string; text: string; color: string };

const clubs = [
  { initials: "CT", name: "CLB Công nghệ", sub: "Xây ý tưởng, tạo sản phẩm", color: "#6966ec" },
  { initials: "TT", name: "CLB Truyền thông", sub: "Sáng tạo và kết nối", color: "#ee9e77" },
  { initials: "SK", name: "CLB Sự kiện", sub: "Mỗi sự kiện là một câu chuyện", color: "#45b59a" },
];
const textChannels = ["thông-báo", "thảo-luận-chung", "dự-án", "tài-nguyên"];
const voiceChannels = ["Phòng sinh hoạt", "Ban Kỹ thuật", "Ban Truyền thông"];
const initialMessages: Record<string, Message[]> = {
  "thông-báo": [
    { id: 1, name: "Minh Anh", initials: "MA", time: "Hôm nay, 09:15", text: "Chào mọi người! Đợt tuyển thành viên mùa thu đã mở. Hãy chia sẻ thông tin đến các bạn quan tâm nhé ✨", color: "peach" },
    { id: 2, name: "Quang Huy", initials: "QH", time: "Hôm nay, 10:24", text: "Buổi họp kế hoạch tháng này diễn ra vào thứ Sáu, 19:30. Mọi người xem agenda trong mục Cuộc họp nha.", color: "purple" },
  ],
  "thảo-luận-chung": [
    { id: 3, name: "Minh Anh", initials: "MA", time: "Hôm nay, 08:42", text: "Chào cả nhà! Tuần này chúng mình sẽ bắt đầu lên ý tưởng cho workshop mới 🙌", color: "peach" },
    { id: 4, name: "Gia Bảo", initials: "GB", time: "Hôm nay, 09:03", text: "Mình có vài ý tưởng về chủ đề AI cho sinh viên, lát mình gửi outline lên nhé.", color: "mint" },
    { id: 5, name: "Quang Huy", initials: "QH", time: "Hôm nay, 09:18", text: "Hay đó! Chiều nay ai rảnh thì vào Phòng sinh hoạt trao đổi nhanh nhé.", color: "purple" },
  ],
  "dự-án": [
    { id: 6, name: "Gia Bảo", initials: "GB", time: "Hôm qua, 16:30", text: "Mình đã cập nhật bản demo ứng dụng. Cả nhóm xem và góp ý ở buổi sync tiếp theo nhé.", color: "mint" },
  ],
  "tài-nguyên": [
    { id: 7, name: "Minh Anh", initials: "MA", time: "12/11, 14:10", text: "Tổng hợp tài liệu onboarding và quy trình làm việc của CLB ở đây nha.", color: "peach" },
  ],
};
const seedApplications: Application[] = [
  { id: 1, name: "Nguyễn Khánh Linh", initials: "KL", department: "Ban Kỹ thuật", submitted: "15/11/2026", status: "Mới nộp", note: "Quan tâm thiết kế sản phẩm và frontend." },
  { id: 2, name: "Trần Đức Anh", initials: "ĐA", department: "Ban Truyền thông", submitted: "14/11/2026", status: "Đang xét duyệt", note: "Có kinh nghiệm làm nội dung cho khoa." },
  { id: 3, name: "Lê Hoàng Phúc", initials: "HP", department: "Ban Kỹ thuật", submitted: "13/11/2026", status: "Chờ phỏng vấn", note: "Thích làm web và cộng đồng mã nguồn mở." },
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    hash: <><path d="M5 9h14M4 15h14M11 3 7 21M17 3l-4 18" /></>,
    volume: <><path d="M11 5 6 9H3v6h3l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7M18 5a10 10 0 0 1 0 14" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></>,
    video: <><rect x="3" y="5" width="14" height="14" rx="2"/><path d="m17 10 4-3v10l-4-3"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    chevron: <path d="m6 9 6 6 6-6"/>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5m-4 0h8"/></>,
    micOff: <><path d="m2 2 20 20M9 9v2a3 3 0 0 0 5.1 2.1M15 9.3V5a3 3 0 0 0-5.8-1M5 10a7 7 0 0 0 12 4.9M19 10a7 7 0 0 1-.8 3.3M12 17v5m-4 0h8"/></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.4 2.8a2 2 0 0 1-.6 1.7L7 10a16 16 0 0 0 7 7l1.8-1.9a2 2 0 0 1 1.7-.6l2.8.4a2 2 0 0 1 1.7 2Z"/>,
    check: <path d="m4 12 5 5L20 6"/>,
    x: <path d="M18 6 6 18M6 6l12 12"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    search: <><circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
    spark: <path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2ZM19 17l.5 1.5L21 19l-1.5.5L19 21l-.5-1.5L17 19l1.5-.5L19 17Z"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Avatar({ initials, color = "purple", size = "normal" }: { initials: string; color?: string; size?: "normal" | "large" }) {
  return <span className={`avatar avatar-${color} ${size === "large" ? "avatar-large" : ""}`}>{initials}</span>;
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

export default function Home() {
  const [clubIndex, setClubIndex] = useState(0);
  const [view, setView] = useState<View>("chat");
  const [channel, setChannel] = useState("thảo-luận-chung");
  const [voice, setVoice] = useState("Phòng sinh hoạt");
  const [joinedVoice, setJoinedVoice] = useState(false);
  const [muted, setMuted] = useState(false);
  const [meetingLive, setMeetingLive] = useState(false);
  const [interviewJoined, setInterviewJoined] = useState(false);
  const [applications, setApplications] = useState<Application[]>(seedApplications);
  const [posts, setPosts] = useState<ClubPost[]>(seedPosts);
  const [activities, setActivities] = useState<ClubActivity[]>(seedActivities);
  const [selectedApplication, setSelectedApplication] = useState<number>(1);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [draft, setDraft] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("Ban Kỹ thuật");
  const [motivation, setMotivation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [applicationTab, setApplicationTab] = useState("Tất cả");
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");

  const club = clubs[clubIndex];
  const selected = applications.find((a) => a.id === selectedApplication) ?? applications[0];
  const filteredApplications = applicationTab === "Tất cả" ? applications : applications.filter((a) => a.status === applicationTab);
  const nav = (next: View) => { setView(next); setMobileNav(false); };
  const notify = (text: string) => { setToast(text); window.setTimeout(() => setToast(""), 3200); };
  const updateStatus = (id: number, status: ApplicationStatus) => {
    setApplications((items) => items.map((a) => a.id === id ? { ...a, status } : a));
    notify(`Đã cập nhật hồ sơ: ${status}`);
  };
  const sendMessage = () => {
    if (!draft.trim()) return;
    setMessages((all) => ({ ...all, [channel]: [...(all[channel] ?? []), { id: Date.now(), name: "Bạn", initials: "BN", time: "Vừa xong", text: draft.trim(), color: "blue" }] }));
    setDraft("");
  };
  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !motivation.trim()) return;
    const id = Date.now();
    setApplications((items) => [{ id, name: fullName.trim(), initials: fullName.trim().split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase(), department, submitted: "16/11/2026", status: "Mới nộp", note: motivation.trim() }, ...items]);
    setSelectedApplication(id);
    setSubmitted(true);
    notify("Đã nộp hồ sơ mẫu thành công");
  };

  return <div className="app-shell">
    <aside className="club-rail" aria-label="Danh sách CLB">
      <button className="rail-logo" title="Clubspace" onClick={() => nav("chat")}><Icon name="spark" size={23}/></button>
      <span className="rail-divider" />
      {clubs.map((item, i) => <button key={item.name} onClick={() => { setClubIndex(i); nav("chat"); }} className={`club-icon ${clubIndex === i ? "club-icon-active" : ""}`} style={{ "--club-color": item.color } as React.CSSProperties} title={item.name}>{item.initials}</button>)}
      <button className="rail-add" title="CLB mới (bản mô phỏng)" onClick={() => notify("Tính năng tạo CLB sẽ có ở phiên bản tiếp theo")}><Icon name="plus" /></button>
      <div className="rail-spacer" />
      <button className="rail-profile" onClick={() => nav("profile")} title="Hồ sơ cá nhân">BN</button>
    </aside>

    <aside className={`channel-sidebar ${mobileNav ? "sidebar-open" : ""}`} aria-label="Điều hướng CLB">
      <div className="club-heading"><div><strong>{club.name}</strong><small>{club.sub}</small></div><Icon name="chevron" size={16}/></div>
      <div className="sidebar-scroll">
        <div className="sidebar-section-label">KHÔNG GIAN CLB <Icon name="chevron" size={13}/></div>
        <div className="sidebar-section-title">TEXT CHANNELS <span>04</span></div>
        {textChannels.map((name) => <button key={name} className={`side-link ${view === "chat" && channel === name ? "side-link-active" : ""}`} onClick={() => { setChannel(name); nav("chat"); }}><Icon name="hash" size={17}/><span>{name}</span>{name === "thông-báo" && <i className="unread-dot" />}</button>)}
        <div className="sidebar-section-title voice-label">VOICE CHANNELS <span>03</span></div>
        {voiceChannels.map((name, i) => <button key={name} className={`side-link ${view === "voice" && voice === name ? "side-link-active" : ""}`} onClick={() => { setVoice(name); nav("voice"); }}><Icon name="volume" size={17}/><span>{name}</span>{i === 0 && <small>3</small>}</button>)}
        <div className="sidebar-section-title tools-label">QUẢN LÝ CLB</div>
        <button className={`side-link ${view === "posts" ? "side-link-active" : ""}`} onClick={() => nav("posts")}><Icon name="file" size={17}/><span>Bài đăng</span><small>{posts.length}</small></button>
        <button className={`side-link ${view === "activities" ? "side-link-active" : ""}`} onClick={() => nav("activities")}><Icon name="calendar" size={17}/><span>Hoạt động</span><small>{activities.length}</small></button>
        <button className={`side-link ${view === "meetings" ? "side-link-active" : ""}`} onClick={() => nav("meetings")}><Icon name="calendar" size={17}/><span>Cuộc họp</span>{meetingLive && <i className="live-dot"/>}</button>
        <button className={`side-link ${view === "recruitment" ? "side-link-active" : ""}`} onClick={() => nav("recruitment")}><Icon name="users" size={17}/><span>Tuyển thành viên</span></button>
        <button className={`side-link ${view === "applications" ? "side-link-active" : ""}`} onClick={() => nav("applications")}><Icon name="file" size={17}/><span>Hồ sơ ứng tuyển</span><small>{applications.length}</small></button>
        <button className={`side-link ${view === "interviews" ? "side-link-active" : ""}`} onClick={() => nav("interviews")}><Icon name="video" size={17}/><span>Phỏng vấn</span></button>
        <button className={`side-link ${view === "profile" ? "side-link-active" : ""}`} onClick={() => nav("profile")}><Icon name="user" size={17}/><span>Hồ sơ cá nhân</span></button>
      </div>
      <div className="sidebar-user" onClick={() => nav("profile")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && nav("profile")}><Avatar initials="BN" color="blue"/><div><strong>Bạn (bản mẫu)</strong><span>Thành viên CLB</span></div><span className="online-indicator"/></div>
    </aside>

    <main className="main-panel">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileNav((v) => !v)} aria-label="Mở điều hướng"><Icon name="menu"/></button>
        <div className="topbar-title"><span className="topbar-icon"><Icon name={view === "chat" ? "hash" : view === "voice" ? "volume" : view === "meetings" || view === "activities" ? "calendar" : view === "recruitment" ? "users" : view === "applications" || view === "posts" ? "file" : view === "interviews" ? "video" : "user"} size={20}/></span><strong>{view === "chat" ? channel : view === "voice" ? voice : { meetings: "Cuộc họp", posts: "Bài đăng", activities: "Hoạt động", recruitment: "Tuyển thành viên", applications: "Hồ sơ ứng tuyển", interviews: "Phỏng vấn", profile: "Hồ sơ cá nhân" }[view]}</strong><span className="topbar-separator"/><span className="topbar-subtitle">{view === "chat" ? "Kết nối và chia sẻ cùng mọi người" : view === "voice" ? "Phòng thoại luôn sẵn sàng" : club.name}</span></div>
        <div className="topbar-actions"><span className="mock-badge">PROTOTYPE · MOCK DATA</span><button title="Hồ sơ" onClick={() => nav("profile")}><Avatar initials="BN" color="blue"/></button></div>
      </header>

      {view === "posts" && <PostManagement posts={posts} setPosts={setPosts} clubName={club.name} notify={notify}/>}
      {view === "activities" && <ActivityManagement activities={activities} setActivities={setActivities} clubName={club.name} notify={notify}/>}

      {view === "chat" && <div className="chat-layout"><section className="chat-content">
        <div className="chat-scroll"><div className="channel-intro"><div className="intro-icon"><Icon name="hash" size={30}/></div><h1>Chào mừng đến #{channel}</h1><p>Đây là nơi bắt đầu mọi cuộc trò chuyện trong {club.name}.</p></div><div className="date-divider"><span>16 THÁNG 11, 2026</span></div>
          {(messages[channel] ?? []).map((m) => <div className="message" key={m.id}><Avatar initials={m.initials} color={m.color}/><div><div className="message-meta"><strong>{m.name}</strong><span>{m.time}</span></div><p>{m.text}</p></div></div>)}
        </div>
        <form className="message-compose" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}><button type="button" aria-label="Thêm tệp (mô phỏng)" onClick={() => notify("Đính kèm tệp chưa có trong prototype")}><Icon name="plus"/></button><input aria-label={`Nhắn tin trong ${channel}`} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`Nhắn tin trong #${channel}`} /><button type="submit" className="send-button" aria-label="Gửi tin nhắn"><Icon name="send" size={18}/></button></form>
      </section><aside className="context-panel"><div className="context-title">TỔNG QUAN CLB</div><div className="club-card"><div className="club-card-symbol" style={{ background: club.color }}>{club.initials}</div><h3>{club.name}</h3><p>{club.sub}</p><div className="club-card-stats"><span><strong>128</strong> thành viên</span><span><strong>12</strong> đang online</span></div></div><div className="context-title spaced">ĐANG DIỄN RA</div><button className="mini-event" onClick={() => nav("meetings")}><span className="mini-event-icon"><Icon name="calendar" size={18}/></span><span><strong>Họp kế hoạch tháng 11</strong><small>Thứ Sáu · 19:30</small></span><Icon name="arrow" size={16}/></button><div className="context-title spaced">ĐANG ONLINE <span>12</span></div><div className="online-user"><Avatar initials="MA" color="peach"/><span>Minh Anh<small>Chủ nhiệm</small></span><i/></div><div className="online-user"><Avatar initials="QH" color="purple"/><span>Quang Huy<small>Ban Kỹ thuật</small></span><i/></div><div className="online-user"><Avatar initials="GB" color="mint"/><span>Gia Bảo<small>Thành viên</small></span><i/></div></aside></div>}

      {view === "voice" && <div className="page-scroll"><div className="page-wrap voice-page"><div className="eyebrow">VOICE CHANNEL · PHÒNG CỐ ĐỊNH</div><div className="page-header"><div><h1>{voice}</h1><p>Vào phòng bất cứ lúc nào. Phòng vẫn ở đây khi mọi người rời đi.</p></div><Pill tone="green">● 3 người đang tham gia</Pill></div><div className="voice-hero"><div className="voice-wave"><span/><span/><span/><span/><span/></div><div><span>KHÔNG GIAN TRÒ CHUYỆN</span><h2>Cùng trò chuyện, không cần đặt lịch</h2><p>Voice channel dành cho trao đổi hằng ngày. Cuộc họp chính thức sẽ có agenda, điểm danh và biên bản riêng.</p></div><button className={joinedVoice ? "button button-danger" : "button button-primary"} onClick={() => { setJoinedVoice((v) => !v); notify(joinedVoice ? "Đã rời phòng thoại" : `Đã tham gia ${voice} (mô phỏng)`); }}><Icon name={joinedVoice ? "phone" : "volume"} size={17}/>{joinedVoice ? "Rời phòng" : "Tham gia phòng"}</button></div><div className="section-heading"><h2>Trong phòng <span>({joinedVoice ? 4 : 3})</span></h2><span>Chỉ hiển thị trạng thái mô phỏng</span></div><div className="participant-grid">{[["MA","Minh Anh","Chủ nhiệm","peach"],["QH","Quang Huy","Ban Kỹ thuật","purple"],["GB","Gia Bảo","Thành viên","mint"], ...(joinedVoice ? [["BN","Bạn","Đang kết nối","blue"]] : [])].map(([initials,name,role,color]) => <div className="participant" key={name}><Avatar initials={initials} color={color} size="large"/><strong>{name}</strong><span>{role}</span><div className="participant-status"><Icon name="mic" size={14}/> Đang bật mic</div></div>)}</div>{joinedVoice && <div className="call-bar"><div><span className="pulse"/> Bạn đang ở {voice}</div><button onClick={() => setMuted((v) => !v)}><Icon name={muted ? "micOff" : "mic"} size={16}/>{muted ? "Bật mic" : "Tắt mic"}</button><button onClick={() => setJoinedVoice(false)}><Icon name="phone" size={16}/> Rời phòng</button></div>}<div className="info-strip"><Icon name="spark" size={18}/><span>Muốn có lịch, agenda và điểm danh? <button onClick={() => nav("meetings")}>Mở cuộc họp chính thức <Icon name="arrow" size={14}/></button></span></div></div></div>}

      {view === "meetings" && <div className="page-scroll"><div className="page-wrap"><div className="eyebrow">QUẢN LÝ CLB / CUỘC HỌP</div><div className="page-header"><div><h1>Cuộc họp chính thức</h1><p>Có lịch, agenda, điểm danh và biên bản cho từng buổi.</p></div><button className="button button-outline" onClick={() => notify("Tạo lịch họp sẽ có ở phiên bản tiếp theo")}><Icon name="plus" size={17}/> Tạo cuộc họp</button></div><div className="meeting-feature"><div className="meeting-feature-main"><div className="meeting-tag"><span className="pulse"/> {meetingLive ? "ĐANG DIỄN RA" : "SẮP DIỄN RA"}</div><h2>Họp kế hoạch tháng 11</h2><p>Cập nhật tiến độ dự án và thống nhất kế hoạch workshop sắp tới.</p><div className="meeting-facts"><span><Icon name="calendar" size={16}/> Thứ Sáu, 20/11/2026</span><span><Icon name="clock" size={16}/> 19:30 – 20:30</span><span><Icon name="volume" size={16}/> Ban Kỹ thuật</span></div><button className="button button-primary" onClick={() => { setMeetingLive((v) => !v); notify(meetingLive ? "Đã kết thúc buổi họp mẫu" : "Cuộc họp mẫu đã bắt đầu"); }}>{meetingLive ? "Kết thúc cuộc họp" : "Bắt đầu cuộc họp"} <Icon name="arrow" size={17}/></button></div><div className="meeting-feature-side"><div className="overlap-avatars"><Avatar initials="MA" color="peach"/><Avatar initials="QH" color="purple"/><Avatar initials="GB" color="mint"/></div><strong>5 thành viên được mời</strong><span>{meetingLive ? "3 người đã điểm danh" : "Sẵn sàng tham gia khi bắt đầu"}</span></div></div><div className="two-columns"><section className="card"><div className="card-heading"><h3>Agenda</h3><Pill tone="purple">3 mục</Pill></div><div className="agenda-row"><span>01</span><div><strong>Cập nhật dự án hiện tại</strong><small>15 phút · Gia Bảo</small></div></div><div className="agenda-row"><span>02</span><div><strong>Kế hoạch workshop AI</strong><small>25 phút · Minh Anh</small></div></div><div className="agenda-row"><span>03</span><div><strong>Phân công công việc</strong><small>20 phút · Cả nhóm</small></div></div></section><section className="card"><div className="card-heading"><h3>Phiên họp & ghi nhận</h3><Pill tone={meetingLive ? "green" : "neutral"}>{meetingLive ? "Live" : "Chưa bắt đầu"}</Pill></div><div className="session-line"><Icon name="users" size={19}/><div><strong>Điểm danh</strong><p>{meetingLive ? "Minh Anh, Quang Huy, Gia Bảo đã tham gia." : "Danh sách tham gia sẽ xuất hiện khi bắt đầu."}</p></div></div><div className="session-line"><Icon name="file" size={19}/><div><strong>Biên bản</strong><p>{meetingLive ? "Đang ghi nhận nội dung buổi họp mẫu." : "Ghi chú và kết luận được lưu theo từng phiên."}</p></div></div></section></div><div className="section-heading"><h2>Lịch họp tiếp theo</h2></div><div className="upcoming-row"><div className="date-tile"><strong>24</strong><span>THÁNG 11</span></div><div><strong>Sync Ban Truyền thông</strong><p>Thứ Ba · 20:00 · Phòng Ban Truyền thông</p></div><Pill tone="neutral">Đã lên lịch</Pill></div></div></div>}

      {view === "recruitment" && <div className="page-scroll"><div className="page-wrap"><div className="eyebrow">CƠ HỘI THAM GIA</div><div className="page-header"><div><h1>Tuyển thành viên mùa thu</h1><p>Khám phá các ban và gửi hồ sơ để bắt đầu hành trình cùng {club.name}.</p></div><Pill tone="green">● Đang mở đơn</Pill></div><div className="recruit-banner"><div><span>ĐỢT TUYỂN THÁNG 11 · 2026</span><h2>Ý tưởng của bạn có chỗ ở đây.</h2><p>Học hỏi, làm dự án thật và tạo nên những điều thú vị cùng nhau.</p></div><div className="banner-shapes"><i/><i/><i/></div></div><div className="two-columns recruit-columns"><section className="card"><div className="card-heading"><h3>Các ban đang tuyển</h3></div>{[["01","Ban Kỹ thuật","Thiết kế, lập trình và phát triển sản phẩm."],["02","Ban Truyền thông","Kể câu chuyện CLB qua hình ảnh và nội dung."],["03","Ban Sự kiện","Lên kế hoạch và tổ chức hoạt động cộng đồng."]].map(([n,title,desc]) => <button className={`department-row ${department === title ? "department-active" : ""}`} key={title} onClick={() => setDepartment(title)}><span>{n}</span><div><strong>{title}</strong><small>{desc}</small></div><Icon name="arrow" size={17}/></button>)}</section><section className="card application-form-card">{submitted ? <div className="success-state"><span className="success-icon"><Icon name="check" size={28}/></span><h2>Đã nhận hồ sơ của bạn!</h2><p>Hồ sơ mẫu đã được thêm vào danh sách. Bạn có thể theo dõi và thử quy trình xét duyệt.</p><button className="button button-primary" onClick={() => nav("applications")}>Xem hồ sơ ứng tuyển <Icon name="arrow" size={16}/></button><button className="text-button" onClick={() => { setSubmitted(false); setFullName(""); setMotivation(""); }}>Nộp một hồ sơ khác</button></div> : <><div className="card-heading"><div><h3>Nộp hồ sơ ứng tuyển</h3><p>Chỉ mất khoảng 2 phút</p></div></div><form onSubmit={submitApplication} className="recruit-form"><label>Họ và tên <span>*</span><input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nhập họ và tên" required /></label><label>Ban muốn ứng tuyển <span>*</span><select value={department} onChange={(e) => setDepartment(e.target.value)}><option>Ban Kỹ thuật</option><option>Ban Truyền thông</option><option>Ban Sự kiện</option></select></label><label>Vì sao bạn muốn tham gia? <span>*</span><textarea value={motivation} onChange={(e) => setMotivation(e.target.value)} placeholder="Chia sẻ đôi chút về bản thân và động lực của bạn..." required /></label><button className="button button-primary" type="submit">Nộp hồ sơ <Icon name="arrow" size={17}/></button><small className="form-note">Bản mô phỏng · thông tin chỉ tồn tại đến khi tải lại trang.</small></form></>}</section></div></div></div>}

      {view === "applications" && <div className="page-scroll"><div className="page-wrap"><div className="eyebrow">TUYỂN THÀNH VIÊN / XÉT DUYỆT</div><div className="page-header"><div><h1>Hồ sơ ứng tuyển</h1><p>Theo dõi từng ứng viên từ lúc nộp đơn đến kết quả cuối cùng.</p></div><button className="button button-outline" onClick={() => nav("recruitment")}><Icon name="plus" size={17}/> Thêm hồ sơ</button></div><div className="stats-row"><div><span>TỔNG HỒ SƠ</span><strong>{applications.length.toString().padStart(2,"0")}</strong><small>Đợt tuyển tháng 11</small></div><div><span>CHỜ XÉT DUYỆT</span><strong>{applications.filter((a) => ["Mới nộp","Đang xét duyệt"].includes(a.status)).length.toString().padStart(2,"0")}</strong><small>Cần phản hồi</small></div><div><span>LỊCH PHỎNG VẤN</span><strong>{applications.filter((a) => a.status === "Chờ phỏng vấn").length.toString().padStart(2,"0")}</strong><small>Đang chờ</small></div></div><div className="application-workspace"><section className="application-list card"><div className="list-heading"><h3>Ứng viên</h3><Icon name="search" size={18}/></div><div className="tabs">{["Tất cả","Mới nộp","Đang xét duyệt","Chờ phỏng vấn"].map((t) => <button key={t} className={applicationTab === t ? "tab-active" : ""} onClick={() => setApplicationTab(t)}>{t}</button>)}</div><div className="candidate-list">{filteredApplications.length === 0 ? <div className="empty-list">Chưa có hồ sơ trong nhóm này.</div> : filteredApplications.map((a) => <button className={`candidate-row ${selectedApplication === a.id ? "candidate-active" : ""}`} key={a.id} onClick={() => setSelectedApplication(a.id)}><Avatar initials={a.initials} color={a.id === 1 ? "peach" : a.id === 2 ? "blue" : "mint"}/><span><strong>{a.name}</strong><small>{a.department} · {a.submitted}</small></span><Icon name="arrow" size={16}/></button>)}</div></section><section className="candidate-detail card"><div className="detail-top"><span>CHI TIẾT HỒ SƠ</span><Pill tone={selected.status === "Trúng tuyển" ? "green" : selected.status === "Chưa phù hợp" ? "red" : selected.status === "Chờ phỏng vấn" ? "purple" : "amber"}>{selected.status}</Pill></div><div className="candidate-identity"><Avatar initials={selected.initials} color="purple" size="large"/><div><h2>{selected.name}</h2><p>Ứng tuyển {selected.department}</p></div></div><div className="detail-divider"/><div className="detail-grid"><div><span>NGÀY NỘP</span><strong>{selected.submitted}</strong></div><div><span>ĐỢT TUYỂN</span><strong>Tháng 11/2026</strong></div></div><div className="detail-note"><span>GIỚI THIỆU / ĐỘNG LỰC</span><p>{selected.note}</p></div><div className="detail-actions"><h3>Chuyển trạng thái</h3><p>Thử quy trình xét duyệt với dữ liệu mẫu.</p><div>{selected.status === "Mới nộp" && <button className="button button-primary" onClick={() => updateStatus(selected.id, "Đang xét duyệt")}>Bắt đầu xét duyệt <Icon name="arrow" size={16}/></button>}{["Mới nộp","Đang xét duyệt"].includes(selected.status) && <button className="button button-outline" onClick={() => updateStatus(selected.id, "Chờ phỏng vấn")}>Lên lịch phỏng vấn</button>}{selected.status === "Chờ phỏng vấn" && <><button className="button button-primary" onClick={() => nav("interviews")}>Mở lịch phỏng vấn <Icon name="arrow" size={16}/></button><button className="button button-outline" onClick={() => updateStatus(selected.id, "Trúng tuyển")}>Đánh dấu trúng tuyển</button></>}{selected.status === "Trúng tuyển" && <button className="button button-outline" onClick={() => nav("profile")}>Xem hồ sơ thành viên</button>}{selected.status !== "Chưa phù hợp" && selected.status !== "Trúng tuyển" && <button className="text-button danger-text" onClick={() => updateStatus(selected.id, "Chưa phù hợp")}>Chưa phù hợp</button>}</div></div></section></div></div></div>}

      {view === "interviews" && <div className="page-scroll"><div className="page-wrap"><div className="eyebrow">TUYỂN THÀNH VIÊN / PHỎNG VẤN</div><div className="page-header"><div><h1>Lịch phỏng vấn</h1><p>Một phòng riêng gắn với từng hồ sơ ứng tuyển và người phỏng vấn.</p></div><Pill tone="purple">01 buổi sắp tới</Pill></div><div className="interview-card"><div className="interview-date"><strong>20</strong><span>THÁNG 11<br/>2026</span></div><div className="interview-main"><div className="interview-meta"><Pill tone={interviewJoined ? "green" : "amber"}>{interviewJoined ? "Đang trong phòng" : "Đã lên lịch"}</Pill><span>19:30 – 19:50</span></div><h2>Phỏng vấn Ban Kỹ thuật</h2><p>Ứng viên: Lê Hoàng Phúc · Người phỏng vấn: Minh Anh, Quang Huy</p><div className="interview-tags"><span><Icon name="clock" size={15}/> 20 phút</span><span><Icon name="user" size={15}/> Phòng riêng</span><span><Icon name="file" size={15}/> Gắn với hồ sơ</span></div><button className={interviewJoined ? "button button-danger" : "button button-primary"} onClick={() => { setInterviewJoined((v) => !v); notify(interviewJoined ? "Đã rời phòng phỏng vấn" : "Đã vào phòng phỏng vấn mẫu"); }}>{interviewJoined ? "Rời phòng phỏng vấn" : "Vào phòng phỏng vấn"} <Icon name={interviewJoined ? "phone" : "arrow"} size={16}/></button></div></div><div className="two-columns"><section className="card"><div className="card-heading"><h3>Quy trình phỏng vấn</h3></div><div className="process-step"><span>1</span><div><strong>Xem hồ sơ</strong><p>Đọc thông tin và câu trả lời ứng viên trước buổi gặp.</p></div><Icon name="check" size={18}/></div><div className="process-step"><span>2</span><div><strong>Vào phòng riêng</strong><p>Ứng viên và người phỏng vấn cùng tham gia theo lịch.</p></div></div><div className="process-step"><span>3</span><div><strong>Đánh giá & kết quả</strong><p>Chuyển trạng thái hồ sơ sau khi kết thúc.</p></div></div></section><section className="card"><div className="card-heading"><h3>Hồ sơ liên quan</h3><Pill tone="neutral">Ứng viên</Pill></div><div className="linked-candidate"><Avatar initials="HP" color="mint" size="large"/><div><strong>Lê Hoàng Phúc</strong><p>Ban Kỹ thuật · Chờ phỏng vấn</p></div></div><p className="linked-note">“Thích làm web và cộng đồng mã nguồn mở.”</p><button className="button button-outline" onClick={() => { setSelectedApplication(3); nav("applications"); }}>Xem & đánh giá hồ sơ <Icon name="arrow" size={16}/></button></section></div></div></div>}

      {view === "profile" && <div className="page-scroll"><div className="page-wrap"><div className="eyebrow">TÀI KHOẢN / THÀNH VIÊN</div><div className="page-header"><div><h1>Hồ sơ cá nhân</h1><p>Thông tin thành viên và hoạt động trong không gian CLB.</p></div><Pill tone="green">● Đang hoạt động</Pill></div><div className="profile-hero"><div className="profile-cover"/><div className="profile-main"><Avatar initials="BN" color="blue" size="large"/><div><h2>Bạn (bản mẫu)</h2><p>Thành viên · {club.name}</p></div><button className="button button-outline" onClick={() => notify("Chỉnh sửa hồ sơ sẽ có ở phiên bản tiếp theo")}>Chỉnh sửa hồ sơ</button></div></div><div className="two-columns"><section className="card"><div className="card-heading"><h3>Hành trình CLB</h3></div><div className="timeline"><div><span className="timeline-dot"/><strong>Tham gia không gian CLB</strong><small>Truy cập text và voice channels theo quyền thành viên</small></div><div><span className="timeline-dot"/><strong>Ứng tuyển</strong><small>Nộp hồ sơ, theo dõi xét duyệt và lịch phỏng vấn</small></div><div><span className="timeline-dot"/><strong>Hoạt động</strong><small>Tham gia cuộc họp và các dự án của CLB</small></div></div></section><section className="card"><div className="card-heading"><h3>Truy cập nhanh</h3></div><button className="quick-link" onClick={() => nav("chat")}><Icon name="hash"/> Kênh trò chuyện <Icon name="arrow" size={16}/></button><button className="quick-link" onClick={() => nav("applications")}><Icon name="file"/> Hồ sơ ứng tuyển <Icon name="arrow" size={16}/></button><button className="quick-link" onClick={() => nav("meetings")}><Icon name="calendar"/> Cuộc họp sắp tới <Icon name="arrow" size={16}/></button></section></div></div></div>}
    </main>
    {mobileNav && <button className="mobile-overlay" onClick={() => setMobileNav(false)} aria-label="Đóng điều hướng"/>}
    {toast && <div className="toast"><Icon name="check" size={16}/>{toast}</div>}
  </div>;
}
