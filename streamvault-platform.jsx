import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// DESIGN TOKENS & CONSTANTS
// ============================================================
const COLORS = {
  bg: "#050508",
  bgSecondary: "#0a0a12",
  bgCard: "rgba(12,12,22,0.85)",
  purple: "#7c3aed",
  purpleLight: "#a855f7",
  purpleGlow: "#9333ea",
  accent: "#c084fc",
  gold: "#f59e0b",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  textDim: "#475569",
  border: "rgba(124,58,237,0.2)",
  borderHover: "rgba(168,85,247,0.5)",
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
`;

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_VIDEOS = [
  { id: 1, title: "The Art of Storytelling", instructor: "James Cameron", category: "Filmmaking", duration: "2h 14m", thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80", progress: 45, isPremium: true, rating: 4.9, students: 12840 },
  { id: 2, title: "Mastering Cinematography", instructor: "Roger Deakins", category: "Filmmaking", duration: "3h 02m", thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80", progress: 0, isPremium: true, rating: 4.8, students: 9320 },
  { id: 3, title: "Sound Design & Music", instructor: "Hans Zimmer", category: "Audio", duration: "1h 48m", thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80", progress: 72, isPremium: false, rating: 4.9, students: 18500 },
  { id: 4, title: "Visual Effects Mastery", instructor: "George Lucas", category: "VFX", duration: "4h 15m", thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80", progress: 0, isPremium: true, rating: 4.7, students: 7650 },
  { id: 5, title: "Director's Vision", instructor: "Christopher Nolan", category: "Direction", duration: "2h 55m", thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80", progress: 18, isPremium: true, rating: 5.0, students: 22100 },
  { id: 6, title: "Color Grading Secrets", instructor: "David Fincher", category: "Post-Production", duration: "1h 30m", thumbnail: "https://images.unsplash.com/photo-1616469829935-c2f83008c0cf?w=800&q=80", progress: 0, isPremium: false, rating: 4.6, students: 5890 },
];

const PLANS = [
  { id: "basic", name: "Basic", price: "Rp 49.000", priceNum: 49000, period: "/bulan", color: "#3b82f6", hours: 20, features: ["20 jam akses/bulan", "HD 720p", "1 perangkat", "Subtitel Indonesia", "Akses katalog dasar"], badge: null },
  { id: "premium", name: "Premium", price: "Rp 99.000", priceNum: 99000, period: "/bulan", color: "#7c3aed", hours: 60, features: ["60 jam akses/bulan", "Full HD 1080p", "3 perangkat", "Semua subtitel", "Akses penuh katalog", "Download offline", "Prioritas support"], badge: "TERPOPULER" },
  { id: "vip", name: "VIP", price: "Rp 199.000", priceNum: 199000, period: "/bulan", color: "#f59e0b", hours: 999, features: ["Akses tidak terbatas", "4K Ultra HD", "10 perangkat", "Semua subtitel", "Konten eksklusif", "Live streaming", "1:1 Mentorship session", "Early access konten baru"], badge: "EKSKLUSIF" },
];

const TESTIMONIALS = [
  { name: "Andi Pratama", role: "Filmmaker Indie", avatar: "AP", text: "StreamVault mengubah cara saya belajar film. Kualitas kontennya luar biasa dan interface-nya sangat premium!", rating: 5 },
  { name: "Siti Rahayu", role: "Content Creator", avatar: "SR", text: "Investasi terbaik yang pernah saya lakukan. Sudah 6 bulan subscribe dan tidak menyesal sama sekali.", rating: 5 },
  { name: "Budi Santoso", role: "Sineas Muda", avatar: "BS", text: "Video player HLS-nya smooth banget bahkan di koneksi lambat. Tim support juga sangat responsif.", rating: 5 },
];

// ============================================================
// GLOBAL STYLES (injected)
// ============================================================
const GlobalStyles = () => (
  <style>{`
    ${FONTS}
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { 
      font-family: 'DM Sans', sans-serif;
      background: ${COLORS.bg};
      color: ${COLORS.text};
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
    ::-webkit-scrollbar-thumb { background: ${COLORS.purple}; border-radius: 3px; }

    @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 20px rgba(124,58,237,0.4); } 50% { box-shadow: 0 0 40px rgba(168,85,247,0.7), 0 0 60px rgba(124,58,237,0.3); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes countdown-tick { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
    @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
    @keyframes neon-flicker { 0%,100% { opacity:1; } 92% { opacity:1; } 93% { opacity:0.8; } 95% { opacity:1; } 97% { opacity:0.9; } }
    @keyframes slide-in-right { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }
    @keyframes progress-fill { from { width: 0; } to { width: var(--target-width); } }

    .fade-up { animation: fadeUp 0.6s ease forwards; }
    .fade-in { animation: fadeIn 0.4s ease forwards; }
    .float { animation: float 3s ease-in-out infinite; }
    .neon-text { animation: neon-flicker 4s infinite; }

    .glass-card {
      background: rgba(12,12,22,0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(124,58,237,0.2);
      border-radius: 16px;
    }
    .glass-card:hover {
      border-color: rgba(168,85,247,0.4);
      box-shadow: 0 8px 40px rgba(124,58,237,0.15);
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #7c3aed, #9333ea);
      color: white;
      border: none;
      padding: 12px 28px;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .btn-primary::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, #9333ea, #a855f7);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(124,58,237,0.5); }
    .btn-primary:hover::before { opacity: 1; }
    .btn-primary:active { transform: translateY(0); }

    .btn-ghost {
      background: transparent;
      color: ${COLORS.textMuted};
      border: 1px solid rgba(124,58,237,0.3);
      padding: 12px 28px;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-ghost:hover { border-color: ${COLORS.purple}; color: ${COLORS.text}; background: rgba(124,58,237,0.1); }

    .video-card {
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
    }
    .video-card:hover { transform: scale(1.03) translateY(-4px); }
    .video-card:hover .card-overlay { opacity: 1; }

    .card-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
      opacity: 0.6;
      transition: opacity 0.3s ease;
      border-radius: 12px;
    }

    .nav-link {
      color: ${COLORS.textMuted};
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.2s;
      cursor: pointer;
      background: none;
      border: none;
      font-family: 'DM Sans', sans-serif;
      padding: 0;
    }
    .nav-link:hover, .nav-link.active { color: ${COLORS.text}; }

    .input-field {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(124,58,237,0.25);
      border-radius: 10px;
      padding: 13px 16px;
      color: ${COLORS.text};
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      outline: none;
      transition: all 0.3s;
    }
    .input-field:focus { border-color: ${COLORS.purple}; background: rgba(124,58,237,0.08); box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
    .input-field::placeholder { color: ${COLORS.textDim}; }

    .progress-bar {
      height: 3px;
      background: rgba(255,255,255,0.1);
      border-radius: 2px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, ${COLORS.purple}, ${COLORS.accent});
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .sidebar-link {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 16px;
      border-radius: 10px;
      color: ${COLORS.textMuted};
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
      font-weight: 500;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      font-family: 'DM Sans', sans-serif;
    }
    .sidebar-link:hover { background: rgba(124,58,237,0.1); color: ${COLORS.text}; }
    .sidebar-link.active { background: rgba(124,58,237,0.2); color: ${COLORS.purpleLight}; border-left: 3px solid ${COLORS.purple}; }

    .stat-card {
      background: rgba(12,12,22,0.9);
      border: 1px solid rgba(124,58,237,0.15);
      border-radius: 14px;
      padding: 20px;
      transition: all 0.3s;
    }
    .stat-card:hover { border-color: rgba(168,85,247,0.35); transform: translateY(-2px); }

    .tooltip {
      position: relative;
    }
    .tooltip:hover::after {
      content: attr(data-tip);
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: rgba(20,20,35,0.95);
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      border: 1px solid rgba(124,58,237,0.3);
      z-index: 100;
    }

    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .badge-premium { background: rgba(124,58,237,0.2); color: ${COLORS.purpleLight}; border: 1px solid rgba(124,58,237,0.4); }
    .badge-vip { background: rgba(245,158,11,0.15); color: ${COLORS.gold}; border: 1px solid rgba(245,158,11,0.4); }
    .badge-free { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
    .badge-live { background: rgba(239,68,68,0.2); color: #f87171; border: 1px solid rgba(239,68,68,0.4); animation: pulse-glow 2s infinite; }

    .notification {
      position: fixed; top: 20px; right: 20px;
      background: rgba(12,12,22,0.95);
      border: 1px solid rgba(124,58,237,0.4);
      border-radius: 12px;
      padding: 16px 20px;
      display: flex; align-items: center; gap: 12px;
      z-index: 9999;
      animation: slide-in-right 0.4s ease;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      max-width: 340px;
    }

    .player-controls {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 20px;
      background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .player-wrap:hover .player-controls { opacity: 1; }

    .countdown-digit {
      font-family: 'Cinzel', serif;
      font-size: 28px;
      font-weight: 700;
      color: ${COLORS.purpleLight};
      animation: countdown-tick 1s ease-in-out infinite;
      display: inline-block;
    }

    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .mobile-full { width: 100% !important; }
    }
    @media (min-width: 769px) {
      .show-mobile-only { display: none !important; }
    }
  `}</style>
);

// ============================================================
// UTILITY HOOKS & FUNCTIONS
// ============================================================
function useCountdown(totalSeconds) {
  const [seconds, setSeconds] = useState(totalSeconds);
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return { h, m, s, total: seconds };
}

function formatTime(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}` : `${m}:${String(sec).padStart(2,'0')}`;
}

// ============================================================
// NOTIFICATION COMPONENT
// ============================================================
function Notification({ message, type = "success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
  const colors = { success: "#4ade80", error: "#f87171", info: COLORS.purpleLight, warning: COLORS.gold };
  return (
    <div className="notification">
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `rgba(${type==="success"?"74,222,128":"168,85,247"},0.2)`, display:"flex", alignItems:"center", justifyContent:"center", color: colors[type], fontWeight: 700, flexShrink:0 }}>
        {icons[type]}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{message}</div>
      </div>
      <button onClick={onClose} style={{ background:"none", border:"none", color: COLORS.textDim, cursor:"pointer", fontSize:18, marginLeft:"auto", padding:"0 4px" }}>×</button>
    </div>
  );
}

// ============================================================
// LOGO COMPONENT
// ============================================================
function Logo({ size = 24 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
      <div style={{ width: size+8, height: size+8, background: "linear-gradient(135deg, #7c3aed, #9333ea)", borderRadius: 8, display:"flex", alignItems:"center", justifyContent:"center", boxShadow: "0 0 20px rgba(124,58,237,0.5)" }}>
        <span style={{ fontSize: size*0.7, color:"white" }}>▶</span>
      </div>
      <span style={{ fontFamily:"'Cinzel', serif", fontSize: size, fontWeight:700, background:"linear-gradient(135deg, #a855f7, #f1f5f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
        StreamVault
      </span>
    </div>
  );
}

// ============================================================
// NAVBAR COMPONENT
// ============================================================
function Navbar({ page, setPage, user, setUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = ["Home","Catalog","Membership","FAQ","Contact"];
  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        padding: "0 24px",
        height: 68,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background: scrolled ? "rgba(5,5,8,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(124,58,237,0.15)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div onClick={() => setPage("home")}><Logo size={20} /></div>
        <div className="hide-mobile" style={{ display:"flex", alignItems:"center", gap:32 }}>
          {links.map(l => (
            <button key={l} className={`nav-link ${page===l.toLowerCase()?"active":""}`} onClick={() => setPage(l.toLowerCase())}>{l}</button>
          ))}
        </div>
        <div className="hide-mobile" style={{ display:"flex", gap:12, alignItems:"center" }}>
          {user ? (
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg, #7c3aed, #9333ea)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, cursor:"pointer" }} onClick={() => setPage("dashboard")}>
                {user.name[0]}
              </div>
              <button className="btn-ghost" style={{ padding:"8px 16px", fontSize:13 }} onClick={() => { setUser(null); setPage("home"); }}>Logout</button>
            </div>
          ) : (
            <>
              <button className="btn-ghost" style={{ padding:"8px 20px", fontSize:14 }} onClick={() => setPage("login")}>Masuk</button>
              <button className="btn-primary" style={{ padding:"8px 20px", fontSize:14 }} onClick={() => setPage("register")}>Daftar Gratis</button>
            </>
          )}
        </div>
        <button className="show-mobile-only" style={{ background:"none", border:"none", color:COLORS.text, fontSize:22, cursor:"pointer" }} onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
      </nav>
      {mobileOpen && (
        <div style={{ position:"fixed", top:68, left:0, right:0, background:"rgba(5,5,8,0.98)", borderBottom:"1px solid rgba(124,58,237,0.2)", zIndex:999, padding:20, backdropFilter:"blur(20px)" }}>
          {links.map(l => (
            <button key={l} className="nav-link" style={{ display:"block", padding:"12px 0", fontSize:16 }} onClick={() => { setPage(l.toLowerCase()); setMobileOpen(false); }}>{l}</button>
          ))}
          <div style={{ display:"flex", gap:12, marginTop:16 }}>
            <button className="btn-ghost" style={{ flex:1 }} onClick={() => { setPage("login"); setMobileOpen(false); }}>Masuk</button>
            <button className="btn-primary" style={{ flex:1 }} onClick={() => { setPage("register"); setMobileOpen(false); }}>Daftar</button>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// VIDEO CARD COMPONENT
// ============================================================
function VideoCard({ video, onClick, style = {} }) {
  return (
    <div className="video-card glass-card" onClick={() => onClick(video)} style={{ overflow:"hidden", position:"relative", ...style }}>
      <div style={{ position:"relative", paddingBottom:"56.25%", overflow:"hidden" }}>
        <img src={video.thumbnail} alt={video.title} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} loading="lazy" />
        <div className="card-overlay" />
        {video.isPremium && <span className="badge badge-premium" style={{ position:"absolute", top:10, left:10, zIndex:2 }}>PREMIUM</span>}
        {video.progress > 0 && (
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:"rgba(255,255,255,0.1)" }}>
            <div style={{ height:"100%", width:`${video.progress}%`, background:"linear-gradient(90deg, #7c3aed, #a855f7)" }} />
          </div>
        )}
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", opacity:0, transition:"opacity 0.3s" }} className="play-btn-overlay">
          <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(124,58,237,0.9)", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)", border:"2px solid rgba(168,85,247,0.6)" }}>
            <span style={{ fontSize:20 }}>▶</span>
          </div>
        </div>
      </div>
      <div style={{ padding:"14px 16px" }}>
        <div style={{ fontSize:13, color:COLORS.textDim, marginBottom:4 }}>{video.category}</div>
        <div style={{ fontSize:15, fontWeight:600, color:COLORS.text, marginBottom:8, lineHeight:1.3 }}>{video.title}</div>
        <div style={{ fontSize:13, color:COLORS.textMuted, marginBottom:10 }}>{video.instructor}</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12, color:COLORS.textDim }}>
          <span>⏱ {video.duration}</span>
          <span style={{ color:COLORS.gold }}>★ {video.rating}</span>
        </div>
        {video.progress > 0 && (
          <div style={{ marginTop:10 }}>
            <div className="progress-bar"><div className="progress-fill" style={{ width:`${video.progress}%` }} /></div>
            <div style={{ fontSize:11, color:COLORS.textDim, marginTop:4 }}>{video.progress}% selesai</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MEMBERSHIP CARD
// ============================================================
function MembershipCard({ plan, onSelect, isSelected, isCurrentPlan }) {
  return (
    <div onClick={() => onSelect(plan)} style={{
      background: isSelected || plan.badge ? `rgba(12,12,22,0.9)` : "rgba(10,10,18,0.8)",
      border: `1px solid ${isSelected ? plan.color : isCurrentPlan ? plan.color+"80" : "rgba(124,58,237,0.2)"}`,
      borderRadius: 20,
      padding: 32,
      cursor:"pointer",
      transition:"all 0.3s ease",
      position:"relative",
      overflow:"hidden",
      transform: (isSelected || plan.badge) ? "scale(1.03)" : "scale(1)",
      boxShadow: isSelected ? `0 0 40px ${plan.color}30, 0 20px 60px rgba(0,0,0,0.4)` : "none",
    }}>
      {plan.badge && (
        <div style={{ position:"absolute", top:16, right:16, background:`${plan.color}25`, color:plan.color, border:`1px solid ${plan.color}50`, padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700, letterSpacing:"0.05em" }}>
          {plan.badge}
        </div>
      )}
      <div style={{ position:"absolute", top:-40, right:-40, width:120, height:120, borderRadius:"50%", background:`${plan.color}10`, filter:"blur(20px)" }} />
      <div style={{ fontFamily:"'Cinzel', serif", fontSize:22, fontWeight:700, color:plan.color, marginBottom:8 }}>{plan.name}</div>
      <div style={{ marginBottom:24 }}>
        <span style={{ fontFamily:"'Cinzel', serif", fontSize:36, fontWeight:900, color:COLORS.text }}>{plan.price}</span>
        <span style={{ fontSize:14, color:COLORS.textMuted }}>{plan.period}</span>
      </div>
      {plan.hours < 999 && (
        <div style={{ background:`${plan.color}15`, border:`1px solid ${plan.color}30`, borderRadius:10, padding:"10px 16px", marginBottom:20, textAlign:"center" }}>
          <span style={{ fontSize:22, fontWeight:700, color:plan.color }}>{plan.hours}</span>
          <span style={{ fontSize:13, color:COLORS.textMuted, marginLeft:6 }}>jam akses/bulan</span>
        </div>
      )}
      <div style={{ marginBottom:28 }}>
        {plan.features.map((f,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,0.05)", fontSize:14, color:COLORS.textMuted }}>
            <span style={{ color:plan.color, fontSize:12 }}>✓</span> {f}
          </div>
        ))}
      </div>
      <button className={isCurrentPlan ? "btn-ghost" : "btn-primary"} style={{
        width:"100%",
        background: isCurrentPlan ? "transparent" : `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)`,
        border: isCurrentPlan ? `1px solid ${plan.color}` : "none",
        color: isCurrentPlan ? plan.color : "white",
        boxShadow: isSelected && !isCurrentPlan ? `0 8px 25px ${plan.color}50` : "none",
      }}>
        {isCurrentPlan ? "Plan Saat Ini" : "Pilih Plan Ini"}
      </button>
    </div>
  );
}

// ============================================================
// COUNTDOWN TIMER COMPONENT
// ============================================================
function CountdownTimer({ totalSeconds, label = "Sisa Waktu Akses" }) {
  const { h, m, s } = useCountdown(totalSeconds);
  const pct = (totalSeconds / (60*60*60)) * 100; // out of 60 hours
  return (
    <div style={{ background:"rgba(12,12,22,0.8)", border:"1px solid rgba(124,58,237,0.3)", borderRadius:16, padding:24 }}>
      <div style={{ fontSize:12, color:COLORS.textDim, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>{label}</div>
      <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:16 }}>
        {[{val:h,label:"Jam"},{val:m,label:"Menit"},{val:s,label:"Detik"}].map((item,i) => (
          <div key={i} style={{ textAlign:"center" }}>
            <div style={{
              background:"rgba(124,58,237,0.15)",
              border:"1px solid rgba(124,58,237,0.3)",
              borderRadius:10,
              padding:"10px 16px",
              minWidth:64,
            }}>
              <div className="countdown-digit">{String(item.val).padStart(2,"0")}</div>
            </div>
            <div style={{ fontSize:10, color:COLORS.textDim, marginTop:5, letterSpacing:"0.05em" }}>{item.label}</div>
          </div>
        ))}
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width:`${Math.max(3,pct)}%` }} />
      </div>
    </div>
  );
}

// ============================================================
// LANDING PAGE
// ============================================================
function LandingPage({ setPage, setSelectedVideo }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("premium");

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(i => (i+1)%TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { q:"Apa itu StreamVault?", a:"StreamVault adalah platform streaming premium untuk belajar dari para maestro industri film, audio, dan konten kreatif." },
    { q:"Apakah ada garansi uang kembali?", a:"Ya, kami memberikan garansi uang kembali 7 hari jika Anda tidak puas dengan layanan kami." },
    { q:"Bisa diakses dari berapa perangkat?", a:"Tergantung plan: Basic (1), Premium (3), VIP (10 perangkat)." },
    { q:"Apakah bisa download video?", a:"Fitur download tersedia untuk subscriber Premium dan VIP." },
  ];
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ minHeight:"100vh" }}>
      {/* HERO */}
      <div style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(5,5,8,0.95) 0%, rgba(20,10,40,0.8) 50%, rgba(5,5,8,0.95) 100%)" }} />
        <div style={{ position:"absolute", top:"20%", right:"10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", filter:"blur(40px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"10%", left:"5%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)", filter:"blur(30px)", pointerEvents:"none" }} />
        <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80" alt="hero" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.15 }} />
        
        <div style={{ position:"relative", maxWidth:1200, margin:"0 auto", padding:"120px 24px 80px", width:"100%" }}>
          <div style={{ maxWidth:700 }} className="fade-up">
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.35)", borderRadius:20, padding:"6px 16px", marginBottom:28, fontSize:13, color:COLORS.accent }}>
              <span style={{ animation:"pulse-glow 2s infinite", display:"inline-block", width:6, height:6, borderRadius:"50%", background:COLORS.purpleLight }} />
              Platform Streaming Premium #1 di Indonesia
            </div>
            <h1 className="neon-text" style={{ fontFamily:"'Cinzel', serif", fontSize:"clamp(36px, 5vw, 72px)", fontWeight:900, lineHeight:1.1, marginBottom:24, background:"linear-gradient(135deg, #f1f5f9 0%, #a855f7 50%, #f1f5f9 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Belajar dari<br />Para Maestro Dunia
            </h1>
            <p style={{ fontSize:"clamp(16px, 2vw, 20px)", color:COLORS.textMuted, lineHeight:1.7, marginBottom:36, maxWidth:560 }}>
              Akses ribuan video premium dari sutradara, musisi, dan kreator terbaik dunia. Tingkatkan skill Anda ke level berikutnya.
            </p>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              <button className="btn-primary" style={{ padding:"16px 36px", fontSize:16, animation:"pulse-glow 3s infinite" }} onClick={() => setPage("register")}>
                Mulai Gratis 7 Hari ✦
              </button>
              <button className="btn-ghost" style={{ padding:"16px 36px", fontSize:16 }} onClick={() => setSelectedVideo(MOCK_VIDEOS[0])}>
                ▶ Lihat Preview
              </button>
            </div>
            <div style={{ display:"flex", gap:32, marginTop:40, flexWrap:"wrap" }}>
              {[["10K+","Video Premium"],["500+","Instruktur Expert"],["50K+","Member Aktif"]].map(([n,l])=>(
                <div key={l}>
                  <div style={{ fontFamily:"'Cinzel', serif", fontSize:24, fontWeight:700, color:COLORS.purpleLight }}>{n}</div>
                  <div style={{ fontSize:13, color:COLORS.textDim }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:120, background:"linear-gradient(to top, #050508, transparent)" }} />
      </div>

      {/* FEATURED VIDEOS */}
      <section style={{ padding:"80px 24px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:40 }}>
          <div>
            <div style={{ fontSize:13, color:COLORS.purple, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>PILIHAN EDITOR</div>
            <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:32, fontWeight:700, color:COLORS.text }}>Video Terfeatured</h2>
          </div>
          <button className="btn-ghost" style={{ padding:"10px 20px", fontSize:14 }} onClick={() => setPage("catalog")}>Lihat Semua →</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:24 }}>
          {MOCK_VIDEOS.map(v => (
            <VideoCard key={v.id} video={v} onClick={setSelectedVideo} />
          ))}
        </div>
      </section>

      {/* MEMBERSHIP */}
      <section style={{ padding:"80px 24px", background:"linear-gradient(180deg, transparent, rgba(20,10,40,0.4), transparent)" }} id="membership">
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ fontSize:13, color:COLORS.purple, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>PILIH PAKET</div>
            <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:40, fontWeight:700, color:COLORS.text, marginBottom:16 }}>Mulai Perjalanan Anda</h2>
            <p style={{ fontSize:16, color:COLORS.textMuted, maxWidth:500, margin:"0 auto" }}>Pilih paket yang sesuai dengan kebutuhan belajar Anda</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:24 }}>
            {PLANS.map(plan => (
              <MembershipCard key={plan.id} plan={plan} onSelect={p => setSelectedPlan(p.id)} isSelected={selectedPlan===plan.id} isCurrentPlan={false} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:"80px 24px", maxWidth:900, margin:"0 auto", textAlign:"center" }}>
        <div style={{ fontSize:13, color:COLORS.purple, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>TESTIMONI</div>
        <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:32, fontWeight:700, color:COLORS.text, marginBottom:48 }}>Yang Mereka Katakan</h2>
        <div style={{ position:"relative", minHeight:200 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ display:i===activeTestimonial?"block":"none", animation:"fadeIn 0.5s ease" }}>
              <div className="glass-card" style={{ padding:40, maxWidth:680, margin:"0 auto" }}>
                <div style={{ fontSize:48, color:COLORS.purple, lineHeight:1, marginBottom:16, opacity:0.6 }}>"</div>
                <p style={{ fontSize:18, color:COLORS.textMuted, lineHeight:1.7, fontStyle:"italic", marginBottom:24 }}>{t.text}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg, #7c3aed, #9333ea)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{t.avatar}</div>
                  <div style={{ textAlign:"left" }}>
                    <div style={{ fontWeight:600, fontSize:15 }}>{t.name}</div>
                    <div style={{ fontSize:13, color:COLORS.textDim }}>{t.role}</div>
                  </div>
                  <div style={{ marginLeft:"auto", color:COLORS.gold, fontSize:18 }}>{"★".repeat(t.rating)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:24 }}>
          {TESTIMONIALS.map((_,i)=>(
            <button key={i} onClick={() => setActiveTestimonial(i)} style={{ width:8, height:8, borderRadius:"50%", background:i===activeTestimonial?COLORS.purple:"rgba(255,255,255,0.2)", border:"none", cursor:"pointer", transition:"all 0.3s", padding:0 }} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:"60px 24px", maxWidth:800, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:32, fontWeight:700, color:COLORS.text }}>Pertanyaan Umum</h2>
        </div>
        {faqs.map((faq,i) => (
          <div key={i} className="glass-card" style={{ marginBottom:12, overflow:"hidden" }}>
            <button onClick={() => setOpenFaq(openFaq===i?null:i)} style={{ width:"100%", padding:"20px 24px", background:"none", border:"none", color:COLORS.text, fontSize:15, fontWeight:600, textAlign:"left", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", fontFamily:"'DM Sans', sans-serif" }}>
              {faq.q}
              <span style={{ color:COLORS.purple, fontSize:20, transform:openFaq===i?"rotate(45deg)":"rotate(0)", transition:"transform 0.3s", display:"inline-block", flexShrink:0 }}>+</span>
            </button>
            {openFaq===i && (
              <div style={{ padding:"0 24px 20px", color:COLORS.textMuted, fontSize:14, lineHeight:1.7 }} className="fade-in">{faq.a}</div>
            )}
          </div>
        ))}
      </section>

      {/* CTA BANNER */}
      <section style={{ padding:"80px 24px", textAlign:"center" }}>
        <div style={{ maxWidth:700, margin:"0 auto", background:"linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.1))", border:"1px solid rgba(124,58,237,0.3)", borderRadius:24, padding:60 }}>
          <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:36, fontWeight:700, marginBottom:16 }}>Siap Memulai?</h2>
          <p style={{ color:COLORS.textMuted, fontSize:16, marginBottom:32 }}>Bergabung dengan 50.000+ kreator yang sudah belajar di StreamVault</p>
          <button className="btn-primary" style={{ padding:"16px 48px", fontSize:16, animation:"pulse-glow 3s infinite" }} onClick={() => setPage("register")}>
            Daftar Sekarang — Gratis
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(124,58,237,0.15)", padding:"48px 24px 32px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:40, marginBottom:48 }}>
            <div>
              <Logo size={18} />
              <p style={{ fontSize:14, color:COLORS.textDim, marginTop:16, lineHeight:1.7 }}>Platform streaming premium untuk kreator dan pelajar Indonesia.</p>
            </div>
            {[["Platform",["Catalog","Membership","FAQ","Tentang Kami"]],["Hukum",["Privasi","Syarat","Cookie"]],["Kontak",["hello@streamvault.id","Instagram","Twitter"]]].map(([title, items]) => (
              <div key={title}>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:16, color:COLORS.text }}>{title}</div>
                {items.map(item => <div key={item} style={{ fontSize:14, color:COLORS.textDim, marginBottom:8, cursor:"pointer" }}>{item}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <div style={{ fontSize:13, color:COLORS.textDim }}>© 2025 StreamVault. All rights reserved.</div>
            <div style={{ display:"flex", gap:16 }}>
              {["Midtrans","QRIS","BCA","Mandiri"].map(p => (
                <span key={p} style={{ fontSize:11, color:COLORS.textDim, background:"rgba(255,255,255,0.06)", padding:"4px 10px", borderRadius:6 }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================
// AUTH PAGES
// ============================================================
function AuthPage({ type, setPage, setUser }) {
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({ name: form.name || "Demo User", email: form.email || "demo@streamvault.id", plan:"premium", hoursLeft: 42*3600 });
      setPage("dashboard");
    }, 1500);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"100px 24px 40px", position:"relative" }}>
      <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", filter:"blur(60px)", pointerEvents:"none" }} />
      <div className="glass-card fade-up" style={{ width:"100%", maxWidth:440, padding:40 }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div onClick={() => setPage("home")} style={{ cursor:"pointer", display:"inline-block", marginBottom:24 }}><Logo size={20} /></div>
          <h1 style={{ fontFamily:"'Cinzel', serif", fontSize:26, fontWeight:700, marginBottom:8 }}>
            {type==="login" ? "Selamat Datang" : type==="register" ? "Buat Akun" : "Reset Password"}
          </h1>
          <p style={{ fontSize:14, color:COLORS.textMuted }}>
            {type==="login" ? "Masuk ke akun Anda" : type==="register" ? "Bergabung dengan StreamVault" : "Kami akan kirim link reset ke email Anda"}
          </p>
        </div>

        {/* Social Login */}
        {type !== "forgot" && (
          <>
            <button className="btn-ghost" style={{ width:"100%", marginBottom:12, display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"13px" }}>
              <span style={{ fontSize:18 }}>G</span> Lanjutkan dengan Google
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
              <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.1)" }} />
              <span style={{ fontSize:12, color:COLORS.textDim }}>atau</span>
              <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.1)" }} />
            </div>
          </>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {type==="register" && (
            <div>
              <label style={{ fontSize:13, color:COLORS.textMuted, marginBottom:6, display:"block" }}>Nama Lengkap</label>
              <input className="input-field" placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
            </div>
          )}
          <div>
            <label style={{ fontSize:13, color:COLORS.textMuted, marginBottom:6, display:"block" }}>Email</label>
            <input className="input-field" type="email" placeholder="nama@email.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
          </div>
          {type !== "forgot" && (
            <div>
              <label style={{ fontSize:13, color:COLORS.textMuted, marginBottom:6, display:"block" }}>Password</label>
              <div style={{ position:"relative" }}>
                <input className="input-field" type={showPass?"text":"password"} placeholder="Min. 8 karakter" value={form.password} onChange={e => setForm({...form, password:e.target.value})} style={{ paddingRight:44 }} />
                <button onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:COLORS.textDim, cursor:"pointer", fontSize:16 }}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>
          )}
          {type==="register" && (
            <div>
              <label style={{ fontSize:13, color:COLORS.textMuted, marginBottom:6, display:"block" }}>Konfirmasi Password</label>
              <input className="input-field" type="password" placeholder="Ulangi password" value={form.confirm} onChange={e => setForm({...form, confirm:e.target.value})} />
            </div>
          )}

          {type==="login" && (
            <div style={{ textAlign:"right" }}>
              <button className="nav-link" style={{ fontSize:13, color:COLORS.purple }} onClick={() => setPage("forgot")}>Lupa password?</button>
            </div>
          )}

          <button className="btn-primary" style={{ width:"100%", padding:15, fontSize:15, marginTop:8, position:"relative", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }} onClick={handleSubmit} disabled={loading}>
            {loading && <div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"rotate 0.8s linear infinite" }} />}
            {loading ? "Memproses..." : type==="login" ? "Masuk" : type==="register" ? "Daftar Sekarang" : "Kirim Link Reset"}
          </button>
        </div>

        <div style={{ textAlign:"center", marginTop:24, fontSize:14, color:COLORS.textMuted }}>
          {type==="login" ? <>Belum punya akun? <button className="nav-link" style={{ color:COLORS.purple, fontWeight:600 }} onClick={() => setPage("register")}>Daftar gratis</button></> :
           type==="register" ? <>Sudah punya akun? <button className="nav-link" style={{ color:COLORS.purple, fontWeight:600 }} onClick={() => setPage("login")}>Masuk</button></> :
           <button className="nav-link" style={{ color:COLORS.purple }} onClick={() => setPage("login")}>← Kembali ke login</button>}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ user, setPage, setSelectedVideo }) {
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = [
    { id:"home", icon:"⌂", label:"Dashboard" },
    { id:"videos", icon:"▶", label:"Video Saya" },
    { id:"history", icon:"⏱", label:"Riwayat Tonton" },
    { id:"favorites", icon:"♥", label:"Favorit" },
    { id:"membership", icon:"✦", label:"Membership" },
    { id:"settings", icon:"⚙", label:"Pengaturan" },
  ];

  const continueWatching = MOCK_VIDEOS.filter(v => v.progress > 0);

  return (
    <div style={{ minHeight:"100vh", paddingTop:68 }}>
      <div style={{ display:"flex" }}>
        {/* SIDEBAR */}
        <div className="hide-mobile" style={{
          width: sidebarOpen ? 240 : 68,
          minHeight:"calc(100vh - 68px)",
          background:"rgba(8,8,15,0.9)",
          borderRight:"1px solid rgba(124,58,237,0.15)",
          position:"sticky", top:68,
          flexShrink:0,
          transition:"width 0.3s ease",
          overflow:"hidden",
          padding:"20px 12px",
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width:"100%", background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:8, padding:"8px", color:COLORS.textMuted, cursor:"pointer", marginBottom:20, fontSize:18 }}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
          {sidebarItems.map(item => (
            <button key={item.id} className={`sidebar-link ${activeTab===item.id?"active":""}`} onClick={() => setActiveTab(item.id)}>
              <span style={{ fontSize:18, flexShrink:0 }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
          <div style={{ marginTop:"auto", paddingTop:20 }}>
            <button className="sidebar-link" onClick={() => setPage("home")} style={{ color:"#f87171" }}>
              <span style={{ fontSize:18 }}>→</span>
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex:1, padding:"32px 24px", maxWidth:"100%" }}>
          {activeTab === "home" && (
            <div className="fade-in">
              {/* Welcome */}
              <div style={{ background:"linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.1))", border:"1px solid rgba(124,58,237,0.3)", borderRadius:20, padding:32, marginBottom:28, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", right:-20, top:-20, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(168,85,247,0.15), transparent)", filter:"blur(30px)" }} />
                <div style={{ position:"relative" }}>
                  <div style={{ fontSize:13, color:COLORS.textDim, marginBottom:6 }}>Selamat datang kembali 👋</div>
                  <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:28, fontWeight:700, marginBottom:12 }}>{user?.name}</h2>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                    <span className="badge badge-premium">✦ PREMIUM MEMBER</span>
                    <span style={{ fontSize:13, color:COLORS.textMuted }}>Expired: 31 Juli 2025</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:16, marginBottom:32 }}>
                {[
                  { label:"Jam Tersisa", value:"42j 15m", icon:"⏱", color:COLORS.purpleLight },
                  { label:"Video Ditonton", value:"23", icon:"▶", color:"#4ade80" },
                  { label:"Sertifikat", value:"3", icon:"✦", color:COLORS.gold },
                  { label:"Streak Belajar", value:"7 Hari", icon:"🔥", color:"#f87171" },
                ].map((s,i)=>(
                  <div key={i} className="stat-card">
                    <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Cinzel', serif", fontSize:22, fontWeight:700, color:s.color }}>{s.value}</div>
                    <div style={{ fontSize:12, color:COLORS.textDim, marginTop:4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Countdown */}
              <CountdownTimer totalSeconds={42*3600 + 15*60} />

              {/* Continue Watching */}
              <div style={{ marginTop:32 }}>
                <h3 style={{ fontFamily:"'Cinzel', serif", fontSize:20, fontWeight:700, marginBottom:20 }}>Lanjutkan Menonton</h3>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:20 }}>
                  {continueWatching.map(v => (
                    <VideoCard key={v.id} video={v} onClick={() => { setSelectedVideo(v); setPage("player"); }} />
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div style={{ marginTop:32 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <h3 style={{ fontFamily:"'Cinzel', serif", fontSize:20, fontWeight:700 }}>🤖 Rekomendasi AI untuk Anda</h3>
                  <span style={{ fontSize:12, color:COLORS.purple, background:"rgba(124,58,237,0.15)", padding:"4px 10px", borderRadius:10 }}>Dipersonalisasi</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:20 }}>
                  {MOCK_VIDEOS.filter(v=>v.progress===0).slice(0,3).map(v=>(
                    <VideoCard key={v.id} video={v} onClick={() => { setSelectedVideo(v); setPage("player"); }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "membership" && (
            <div className="fade-in">
              <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:28, fontWeight:700, marginBottom:8 }}>Membership Saya</h2>
              <p style={{ color:COLORS.textMuted, marginBottom:32 }}>Kelola paket berlangganan Anda</p>
              <div style={{ marginBottom:32 }}>
                <CountdownTimer totalSeconds={42*3600 + 15*60} label="Sisa Jam Akses Bulan Ini" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(270px, 1fr))", gap:24 }}>
                {PLANS.map(plan => (
                  <MembershipCard key={plan.id} plan={plan} onSelect={() => {}} isSelected={false} isCurrentPlan={plan.id==="premium"} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="fade-in">
              <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:28, fontWeight:700, marginBottom:32 }}>Pengaturan Profil</h2>
              <div className="glass-card" style={{ padding:32, maxWidth:560 }}>
                <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:32 }}>
                  <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg, #7c3aed, #9333ea)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:700 }}>{user?.name?.[0]}</div>
                  <div>
                    <div style={{ fontSize:18, fontWeight:600 }}>{user?.name}</div>
                    <div style={{ fontSize:13, color:COLORS.textMuted }}>{user?.email}</div>
                    <button className="btn-ghost" style={{ padding:"6px 14px", fontSize:12, marginTop:8 }}>Ganti Foto</button>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  {[["Nama Lengkap", user?.name],["Email", user?.email],["No. Telepon", "+62 8xx xxxx xxxx"],["Bahasa", "Indonesia"]].map(([l,v])=>(
                    <div key={l}>
                      <label style={{ fontSize:13, color:COLORS.textMuted, marginBottom:6, display:"block" }}>{l}</label>
                      <input className="input-field" defaultValue={v} />
                    </div>
                  ))}
                  <button className="btn-primary" style={{ marginTop:8 }}>Simpan Perubahan</button>
                </div>
              </div>
            </div>
          )}

          {(activeTab === "videos" || activeTab === "history" || activeTab === "favorites") && (
            <div className="fade-in">
              <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:28, fontWeight:700, marginBottom:32 }}>
                {activeTab==="videos" ? "Video Saya" : activeTab==="history" ? "Riwayat Tonton" : "Video Favorit"}
              </h2>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:20 }}>
                {MOCK_VIDEOS.map(v=>(
                  <VideoCard key={v.id} video={v} onClick={() => { setSelectedVideo(v); setPage("player"); }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// VIDEO PLAYER PAGE
// ============================================================
function VideoPlayer({ video, setPage }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(video?.progress || 0);
  const [volume, setVolume] = useState(80);
  const [speed, setSpeed] = useState(1);
  const [liked, setLiked] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState((video?.progress||0) * 134.4); // fake seconds
  const totalDuration = 13440; // 2h 14m in seconds

  useEffect(() => {
    let t;
    if (playing) {
      t = setInterval(() => {
        setCurrentTime(c => {
          const next = Math.min(c + 1, totalDuration);
          setProgress(Math.floor((next/totalDuration)*100));
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [playing]);

  if (!video) return null;

  return (
    <div style={{ minHeight:"100vh", paddingTop:68, background:COLORS.bg }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"24px 24px" }}>
        {/* Back */}
        <button className="btn-ghost" style={{ padding:"8px 16px", fontSize:13, marginBottom:20, display:"flex", alignItems:"center", gap:8 }} onClick={() => setPage("dashboard")}>
          ← Kembali ke Dashboard
        </button>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:24 }} className="hide-mobile">
          {/* PLAYER */}
          <div>
            <div className="player-wrap" style={{ position:"relative", background:"#000", borderRadius:16, overflow:"hidden", aspectRatio:"16/9", cursor:"pointer" }} onClick={() => setPlaying(!playing)}>
              <img src={video.thumbnail} alt={video.title} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.4 }} />
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {!playing && (
                  <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(124,58,237,0.85)", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)", border:"2px solid rgba(168,85,247,0.6)", animation:"pulse-glow 2s infinite" }}>
                    <span style={{ fontSize:32 }}>▶</span>
                  </div>
                )}
                {playing && <div style={{ fontSize:14, color:"rgba(255,255,255,0.7)", background:"rgba(0,0,0,0.5)", padding:"8px 16px", borderRadius:8 }}>▌▌ HLS Streaming Active</div>}
              </div>

              {/* Controls */}
              <div className="player-controls" onClick={e => e.stopPropagation()}>
                {/* Progress */}
                <div className="progress-bar" style={{ height:4, marginBottom:14, cursor:"pointer" }}>
                  <div className="progress-fill" style={{ width:`${progress}%` }} />
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <button onClick={() => setPlaying(!playing)} style={{ background:"none", border:"none", color:"white", fontSize:22, cursor:"pointer" }}>
                    {playing ? "⏸" : "▶"}
                  </button>
                  <button style={{ background:"none", border:"none", color:"rgba(255,255,255,0.7)", fontSize:18, cursor:"pointer" }}>⏭</button>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:16 }}>🔊</span>
                    <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(+e.target.value)} style={{ width:80, accentColor:COLORS.purple }} />
                  </div>
                  <span style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginLeft:4 }}>{formatTime(Math.floor(currentTime))} / {formatTime(totalDuration)}</span>
                  <div style={{ marginLeft:"auto", display:"flex", gap:10 }}>
                    <div style={{ position:"relative" }}>
                      <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"white", fontSize:12, padding:"4px 10px", borderRadius:6, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>{speed}x</button>
                      {showSpeedMenu && (
                        <div style={{ position:"absolute", bottom:30, right:0, background:"rgba(10,10,18,0.98)", border:"1px solid rgba(124,58,237,0.3)", borderRadius:8, overflow:"hidden", zIndex:10 }}>
                          {[0.5,0.75,1,1.25,1.5,2].map(s=>(
                            <button key={s} onClick={()=>{setSpeed(s);setShowSpeedMenu(false);}} style={{ display:"block", width:"100%", padding:"8px 20px", background:speed===s?"rgba(124,58,237,0.2)":"none", border:"none", color:speed===s?COLORS.purpleLight:COLORS.textMuted, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans', sans-serif", textAlign:"left" }}>{s}x</button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={() => setFullscreen(!fullscreen)} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"white", fontSize:14, padding:"4px 10px", borderRadius:6, cursor:"pointer" }}>⛶</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div style={{ marginTop:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
                <div>
                  <div style={{ fontSize:13, color:COLORS.textDim, marginBottom:6 }}>{video.category} • {video.duration}</div>
                  <h1 style={{ fontFamily:"'Cinzel', serif", fontSize:24, fontWeight:700, marginBottom:6 }}>{video.title}</h1>
                  <div style={{ fontSize:14, color:COLORS.textMuted }}>oleh {video.instructor} • ★ {video.rating} ({video.students?.toLocaleString()} students)</div>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={() => setLiked(!liked)} style={{ background:liked?"rgba(236,72,153,0.2)":"rgba(255,255,255,0.08)", border:`1px solid ${liked?"rgba(236,72,153,0.5)":"rgba(255,255,255,0.15)"}`, color:liked?"#f472b6":COLORS.textMuted, padding:"8px 18px", borderRadius:8, cursor:"pointer", fontSize:13, transition:"all 0.2s", fontFamily:"'DM Sans', sans-serif" }}>
                    {liked?"♥":"♡"} {liked?"Disukai":"Suka"}
                  </button>
                  <button style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:COLORS.textMuted, padding:"8px 18px", borderRadius:8, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans', sans-serif" }}>
                    ↗ Share
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop:20, padding:16, background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:8 }}>
                  <span style={{ color:COLORS.textMuted }}>Progress Menonton</span>
                  <span style={{ color:COLORS.purpleLight, fontWeight:600 }}>{progress}%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width:`${progress}%` }} /></div>
              </div>

              {/* Description */}
              <div style={{ marginTop:20 }} className="glass-card" style={{ padding:20, marginTop:20, borderRadius:12 }}>
                <h3 style={{ fontWeight:600, marginBottom:10, fontSize:15 }}>Tentang Video Ini</h3>
                <p style={{ color:COLORS.textMuted, fontSize:14, lineHeight:1.7 }}>
                  Dalam masterclass ini, {video.instructor} berbagi pengalaman mendalam tentang {video.title.toLowerCase()}. 
                  Anda akan belajar teknik-teknik profesional yang digunakan di industri Hollywood dan bagaimana mengaplikasikannya dalam proyek Anda sendiri.
                </p>
              </div>
            </div>
          </div>

          {/* PLAYLIST SIDEBAR */}
          <div>
            <div className="glass-card" style={{ padding:20 }}>
              <h3 style={{ fontFamily:"'Cinzel', serif", fontSize:16, fontWeight:700, marginBottom:20 }}>Playlist</h3>
              {MOCK_VIDEOS.map((v,i) => (
                <div key={v.id} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.06)", cursor:"pointer", borderRadius:8, transition:"background 0.2s" }}>
                  <div style={{ position:"relative", flexShrink:0, width:80, height:50, borderRadius:8, overflow:"hidden" }}>
                    <img src={v.thumbnail} alt={v.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    {v.id === video.id && <div style={{ position:"absolute", inset:0, background:"rgba(124,58,237,0.6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>▶</div>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight: v.id===video.id?700:500, color: v.id===video.id?COLORS.purpleLight:COLORS.text, marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{i+1}. {v.title}</div>
                    <div style={{ fontSize:11, color:COLORS.textDim }}>{v.duration}</div>
                    {v.progress > 0 && <div className="progress-bar" style={{ marginTop:4, height:2 }}><div className="progress-fill" style={{ width:`${v.progress}%` }} /></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Player */}
        <div className="show-mobile-only">
          <div style={{ position:"relative", background:"#000", borderRadius:12, overflow:"hidden", aspectRatio:"16/9", marginBottom:20 }} onClick={() => setPlaying(!playing)}>
            <img src={video.thumbnail} alt={video.title} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.4 }} />
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(124,58,237,0.85)", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:24 }}>▶</span></div>
            </div>
          </div>
          <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:20, fontWeight:700, marginBottom:6 }}>{video.title}</h2>
          <p style={{ color:COLORS.textMuted, fontSize:13, marginBottom:16 }}>{video.instructor} • {video.duration}</p>
          <div className="progress-bar"><div className="progress-fill" style={{ width:`${progress}%` }} /></div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN PANEL
// ============================================================
function AdminPanel({ setPage }) {
  const [adminTab, setAdminTab] = useState("dashboard");

  const stats = [
    { label:"Total Users", value:"12,847", change:"+12%", icon:"👥", color:"#4ade80" },
    { label:"Revenue Bulan Ini", value:"Rp 48.2jt", change:"+23%", icon:"💰", color:COLORS.gold },
    { label:"Video Aktif", value:"1,243", change:"+8%", icon:"▶", color:COLORS.purpleLight },
    { label:"Active Subscriptions", value:"8,921", change:"+18%", icon:"✦", color:"#60a5fa" },
  ];

  const recentUsers = [
    { name:"Andi P.", email:"andi@gmail.com", plan:"Premium", status:"Active", joined:"2025-01-15" },
    { name:"Siti R.", email:"siti@gmail.com", plan:"VIP", status:"Active", joined:"2025-01-14" },
    { name:"Budi S.", email:"budi@gmail.com", plan:"Basic", status:"Expired", joined:"2025-01-12" },
    { name:"Maya K.", email:"maya@gmail.com", plan:"Premium", status:"Active", joined:"2025-01-11" },
    { name:"Reza M.", email:"reza@gmail.com", plan:"Basic", status:"Suspended", joined:"2025-01-10" },
  ];

  const adminSidebar = [
    {id:"dashboard",icon:"⌂",label:"Dashboard"},
    {id:"users",icon:"👥",label:"Manajemen User"},
    {id:"videos",icon:"▶",label:"Upload Video"},
    {id:"payments",icon:"💳",label:"Pembayaran"},
    {id:"analytics",icon:"📊",label:"Analitik"},
    {id:"membership",icon:"✦",label:"Membership"},
  ];

  return (
    <div style={{ minHeight:"100vh", paddingTop:68, display:"flex" }}>
      {/* Admin Sidebar */}
      <div className="hide-mobile" style={{ width:220, minHeight:"calc(100vh - 68px)", background:"rgba(5,5,12,0.98)", borderRight:"1px solid rgba(124,58,237,0.15)", padding:"20px 12px", position:"sticky", top:68, flexShrink:0 }}>
        <div style={{ fontSize:11, color:COLORS.textDim, textTransform:"uppercase", letterSpacing:"0.1em", padding:"0 8px", marginBottom:16 }}>Admin Panel</div>
        {adminSidebar.map(item => (
          <button key={item.id} className={`sidebar-link ${adminTab===item.id?"active":""}`} onClick={() => setAdminTab(item.id)}>
            <span style={{ fontSize:16 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
        <div style={{ marginTop:20, borderTop:"1px solid rgba(124,58,237,0.15)", paddingTop:20 }}>
          <button className="sidebar-link" onClick={() => setPage("home")} style={{ color:"#f87171" }}>
            <span>→</span> <span>Keluar Admin</span>
          </button>
        </div>
      </div>

      {/* Admin Content */}
      <div style={{ flex:1, padding:"28px 24px", overflow:"auto" }}>
        {adminTab === "dashboard" && (
          <div className="fade-in">
            <div style={{ marginBottom:28 }}>
              <h1 style={{ fontFamily:"'Cinzel', serif", fontSize:26, fontWeight:700 }}>Admin Dashboard</h1>
              <p style={{ color:COLORS.textMuted, fontSize:13 }}>Ringkasan performa platform</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:16, marginBottom:32 }}>
              {stats.map((s,i) => (
                <div key={i} className="stat-card">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <span style={{ fontSize:22 }}>{s.icon}</span>
                    <span style={{ fontSize:11, color:"#4ade80", background:"rgba(74,222,128,0.1)", padding:"3px 8px", borderRadius:10 }}>{s.change}</span>
                  </div>
                  <div style={{ fontFamily:"'Cinzel', serif", fontSize:24, fontWeight:700, color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:12, color:COLORS.textDim, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Revenue Chart (visual representation) */}
            <div className="glass-card" style={{ padding:24, marginBottom:24 }}>
              <h3 style={{ fontFamily:"'Cinzel', serif", fontSize:16, fontWeight:700, marginBottom:20 }}>Revenue 6 Bulan Terakhir</h3>
              <div style={{ display:"flex", alignItems:"flex-end", gap:12, height:120 }}>
                {[35,58,42,70,85,100].map((h,i) => (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                    <div style={{ width:"100%", height:`${h}%`, background:`linear-gradient(to top, ${COLORS.purple}, ${COLORS.purpleLight})`, borderRadius:"4px 4px 0 0", opacity:i===5?1:0.6, transition:"opacity 0.3s" }} />
                    <div style={{ fontSize:10, color:COLORS.textDim }}>{"AGUS OKTNODJFAN".split("").filter((_,j)=>j%2===0).join("").slice(0,3).toUpperCase()}
                    {["Agt","Sep","Okt","Nov","Des","Jan"][i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card" style={{ padding:24 }}>
              <h3 style={{ fontFamily:"'Cinzel', serif", fontSize:16, fontWeight:700, marginBottom:20 }}>Aktivitas Terbaru</h3>
              {[
                { action:"User baru mendaftar", user:"andi@gmail.com", time:"2m lalu", type:"success" },
                { action:"Pembayaran diterima", user:"siti@gmail.com", time:"15m lalu", type:"success" },
                { action:"Subscription expired", user:"budi@gmail.com", time:"1j lalu", type:"warning" },
                { action:"Upload video baru", user:"Admin", time:"2j lalu", type:"info" },
                { action:"User dilaporkan", user:"reza@gmail.com", time:"3j lalu", type:"error" },
              ].map((a,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", flexShrink:0, background:{success:"#4ade80",warning:COLORS.gold,error:"#f87171",info:COLORS.purpleLight}[a.type] }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:500 }}>{a.action}</div>
                    <div style={{ fontSize:11, color:COLORS.textDim }}>{a.user}</div>
                  </div>
                  <div style={{ fontSize:11, color:COLORS.textDim }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === "users" && (
          <div className="fade-in">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:24, fontWeight:700 }}>Manajemen User</h2>
              <input className="input-field" placeholder="🔍 Cari user..." style={{ width:240, padding:"9px 14px" }} />
            </div>
            <div className="glass-card" style={{ overflow:"hidden" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ borderBottom:"1px solid rgba(124,58,237,0.2)" }}>
                      {["Nama","Email","Plan","Status","Bergabung","Aksi"].map(h=>(
                        <th key={h} style={{ padding:"14px 16px", textAlign:"left", fontSize:12, color:COLORS.textDim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((u,i) => (
                      <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding:"14px 16px", fontSize:14, fontWeight:500 }}>{u.name}</td>
                        <td style={{ padding:"14px 16px", fontSize:13, color:COLORS.textMuted }}>{u.email}</td>
                        <td style={{ padding:"14px 16px" }}>
                          <span className={`badge ${u.plan==="VIP"?"badge-vip":u.plan==="Premium"?"badge-premium":"badge-free"}`}>{u.plan}</span>
                        </td>
                        <td style={{ padding:"14px 16px" }}>
                          <span style={{ fontSize:12, padding:"3px 10px", borderRadius:10, background:{Active:"rgba(74,222,128,0.15)",Expired:"rgba(255,255,255,0.1)",Suspended:"rgba(239,68,68,0.15)"}[u.status], color:{Active:"#4ade80",Expired:COLORS.textDim,Suspended:"#f87171"}[u.status] }}>{u.status}</span>
                        </td>
                        <td style={{ padding:"14px 16px", fontSize:13, color:COLORS.textDim }}>{u.joined}</td>
                        <td style={{ padding:"14px 16px" }}>
                          <div style={{ display:"flex", gap:8 }}>
                            <button style={{ background:"rgba(124,58,237,0.2)", border:"1px solid rgba(124,58,237,0.3)", color:COLORS.purpleLight, padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:12, fontFamily:"'DM Sans', sans-serif" }}>Edit</button>
                            <button style={{ background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", color:"#f87171", padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:12, fontFamily:"'DM Sans', sans-serif" }}>Suspend</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {adminTab === "videos" && (
          <div className="fade-in">
            <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:24, fontWeight:700, marginBottom:24 }}>Upload Video</h2>
            <div style={{ border:"2px dashed rgba(124,58,237,0.4)", borderRadius:16, padding:60, textAlign:"center", marginBottom:24, background:"rgba(124,58,237,0.05)", cursor:"pointer", transition:"all 0.3s" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>⬆</div>
              <div style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>Drag & Drop Video di Sini</div>
              <div style={{ fontSize:14, color:COLORS.textMuted, marginBottom:20 }}>Atau klik untuk browse file</div>
              <button className="btn-primary" style={{ padding:"10px 24px" }}>Pilih File</button>
              <div style={{ fontSize:12, color:COLORS.textDim, marginTop:12 }}>MP4, MOV, MKV hingga 10GB • HLS otomatis diproses</div>
            </div>
            <div className="glass-card" style={{ padding:24 }}>
              <h3 style={{ fontWeight:600, marginBottom:16 }}>Detail Video</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {[["Judul Video",""],["Instruktur",""],["Kategori",""],["Durasi",""]].map(([l,v],i)=>(
                  <div key={i}>
                    <label style={{ fontSize:13, color:COLORS.textMuted, marginBottom:6, display:"block" }}>{l}</label>
                    <input className="input-field" placeholder={l} defaultValue={v} />
                  </div>
                ))}
                <div style={{ gridColumn:"1 / -1" }}>
                  <label style={{ fontSize:13, color:COLORS.textMuted, marginBottom:6, display:"block" }}>Deskripsi</label>
                  <textarea className="input-field" rows={4} placeholder="Deskripsi video..." style={{ resize:"vertical" }} />
                </div>
                <div>
                  <label style={{ fontSize:13, color:COLORS.textMuted, marginBottom:6, display:"block" }}>Akses</label>
                  <select className="input-field" style={{ appearance:"none" }}>
                    <option>Premium & VIP</option>
                    <option>VIP Only</option>
                    <option>Semua Member</option>
                    <option>Gratis</option>
                  </select>
                </div>
              </div>
              <button className="btn-primary" style={{ marginTop:20, padding:"12px 32px" }}>Upload & Publish</button>
            </div>
          </div>
        )}

        {adminTab === "payments" && (
          <div className="fade-in">
            <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:24, fontWeight:700, marginBottom:24 }}>Riwayat Pembayaran</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:16, marginBottom:24 }}>
              {[["Total Revenue","Rp 348.2jt","#4ade80"],["Bulan Ini","Rp 48.2jt",COLORS.gold],["Pending","Rp 2.1jt","#60a5fa"],["Refund","Rp 0.8jt","#f87171"]].map(([l,v,c])=>(
                <div key={l} className="stat-card">
                  <div style={{ fontFamily:"'Cinzel', serif", fontSize:20, fontWeight:700, color:c }}>{v}</div>
                  <div style={{ fontSize:12, color:COLORS.textDim, marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="glass-card" style={{ overflow:"hidden" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ borderBottom:"1px solid rgba(124,58,237,0.2)" }}>
                      {["ID","User","Plan","Jumlah","Metode","Status","Tanggal"].map(h=>(
                        <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:12, color:COLORS.textDim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["#TRX001","andi@gmail.com","Premium","Rp 99.000","QRIS","Sukses","2025-01-15"],
                      ["#TRX002","siti@gmail.com","VIP","Rp 199.000","Midtrans","Sukses","2025-01-14"],
                      ["#TRX003","budi@gmail.com","Basic","Rp 49.000","BCA","Pending","2025-01-13"],
                      ["#TRX004","maya@gmail.com","Premium","Rp 99.000","Mandiri","Sukses","2025-01-12"],
                    ].map((row,i)=>(
                      <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                        {row.map((cell,j)=>(
                          <td key={j} style={{ padding:"12px 16px", fontSize:13, color:j===5?{Sukses:"#4ade80",Pending:COLORS.gold,Gagal:"#f87171"}[cell]:j===0?COLORS.purple:COLORS.textMuted }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {adminTab === "analytics" && (
          <div className="fade-in">
            <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:24, fontWeight:700, marginBottom:24 }}>Analitik Platform</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
              <div className="glass-card" style={{ padding:24 }}>
                <h3 style={{ fontWeight:600, marginBottom:16, fontSize:15 }}>Top Video</h3>
                {MOCK_VIDEOS.slice(0,4).map((v,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontFamily:"'Cinzel', serif", fontSize:18, color:COLORS.textDim, width:24, textAlign:"center" }}>{i+1}</div>
                    <img src={v.thumbnail} style={{ width:48, height:32, objectFit:"cover", borderRadius:6 }} alt="" />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v.title}</div>
                      <div style={{ fontSize:11, color:COLORS.textDim }}>{v.students?.toLocaleString()} views</div>
                    </div>
                    <div style={{ fontSize:12, color:COLORS.purpleLight }}>★ {v.rating}</div>
                  </div>
                ))}
              </div>
              <div className="glass-card" style={{ padding:24 }}>
                <h3 style={{ fontWeight:600, marginBottom:20, fontSize:15 }}>Distribusi Membership</h3>
                {[["Basic","32%","#3b82f6",32],["Premium","51%","#7c3aed",51],["VIP","17%","#f59e0b",17]].map(([n,p,c,w])=>(
                  <div key={n} style={{ marginBottom:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:13 }}>
                      <span style={{ color:COLORS.textMuted }}>{n}</span>
                      <span style={{ color:c, fontWeight:600 }}>{p}</span>
                    </div>
                    <div className="progress-bar">
                      <div style={{ height:"100%", width:`${w}%`, background:c, borderRadius:2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {adminTab === "membership" && (
          <div className="fade-in">
            <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:24, fontWeight:700, marginBottom:24 }}>Manajemen Membership</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:24 }}>
              {PLANS.map(plan=>(
                <div key={plan.id} className="glass-card" style={{ padding:24 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                    <div style={{ fontFamily:"'Cinzel', serif", fontSize:18, fontWeight:700, color:plan.color }}>{plan.name}</div>
                    <button className="btn-ghost" style={{ padding:"6px 14px", fontSize:12 }}>Edit</button>
                  </div>
                  <div style={{ fontSize:24, fontWeight:700, marginBottom:4 }}>{plan.price}<span style={{ fontSize:13, color:COLORS.textMuted }}>{plan.period}</span></div>
                  <div style={{ fontSize:13, color:COLORS.textMuted, marginBottom:16 }}>{plan.hours < 999 ? `${plan.hours} jam/bulan` : "Unlimited"}</div>
                  <div style={{ display:"flex", gap:16, fontSize:13 }}>
                    <div><span style={{ fontWeight:600, color:plan.color }}>2,341</span><br/><span style={{ color:COLORS.textDim, fontSize:11 }}>Subscriber</span></div>
                    <div><span style={{ fontWeight:600, color:"#4ade80" }}>+12%</span><br/><span style={{ color:COLORS.textDim, fontSize:11 }}>Growth</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// PAYMENT MODAL
// ============================================================
function PaymentModal({ plan, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1=method, 2=confirm, 3=success
  const [method, setMethod] = useState("");

  const methods = [
    { id:"qris", label:"QRIS", icon:"⬛", desc:"Scan QR - semua e-wallet" },
    { id:"va_bca", label:"Virtual Account BCA", icon:"🏦", desc:"Transfer ke nomor VA" },
    { id:"va_mandiri", label:"Virtual Account Mandiri", icon:"🏛", desc:"Transfer ke nomor VA" },
    { id:"gopay", label:"GoPay", icon:"💚", desc:"Via aplikasi Gojek" },
    { id:"ovo", label:"OVO", icon:"💜", desc:"Via aplikasi OVO" },
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9000, padding:20 }} onClick={e => e.target===e.currentTarget&&onClose()}>
      <div className="glass-card fade-up" style={{ width:"100%", maxWidth:480, padding:36 }}>
        {step === 1 && (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:22, fontWeight:700 }}>Pilih Pembayaran</h2>
              <button onClick={onClose} style={{ background:"none", border:"none", color:COLORS.textDim, fontSize:24, cursor:"pointer" }}>×</button>
            </div>
            <div style={{ background:`${plan.color}15`, border:`1px solid ${plan.color}30`, borderRadius:12, padding:16, marginBottom:24 }}>
              <div style={{ fontSize:13, color:COLORS.textMuted }}>Plan Dipilih</div>
              <div style={{ fontFamily:"'Cinzel', serif", fontSize:20, fontWeight:700, color:plan.color }}>{plan.name} — {plan.price}{plan.period}</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {methods.map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{ background:method===m.id?"rgba(124,58,237,0.15)":"rgba(255,255,255,0.04)", border:`1px solid ${method===m.id?"rgba(124,58,237,0.5)":"rgba(255,255,255,0.1)"}`, borderRadius:10, padding:"14px 16px", display:"flex", alignItems:"center", gap:14, cursor:"pointer", transition:"all 0.2s", textAlign:"left" }}>
                  <span style={{ fontSize:22 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:method===m.id?COLORS.purpleLight:COLORS.text, fontFamily:"'DM Sans', sans-serif" }}>{m.label}</div>
                    <div style={{ fontSize:12, color:COLORS.textDim, fontFamily:"'DM Sans', sans-serif" }}>{m.desc}</div>
                  </div>
                  {method===m.id && <div style={{ marginLeft:"auto", color:COLORS.purple, fontSize:20 }}>●</div>}
                </button>
              ))}
            </div>
            <button className="btn-primary" style={{ width:"100%", padding:14, marginTop:20, fontSize:15 }} disabled={!method} onClick={() => setStep(2)}>
              Lanjutkan →
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ textAlign:"center" }}>
              <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:22, fontWeight:700, marginBottom:6 }}>Konfirmasi Pembayaran</h2>
              <p style={{ color:COLORS.textMuted, fontSize:14, marginBottom:28 }}>Periksa detail sebelum melanjutkan</p>
              <div style={{ background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:12, padding:24, marginBottom:20 }}>
                {method === "qris" && (
                  <div style={{ width:160, height:160, background:"white", margin:"0 auto 16px", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", padding:12 }}>
                    <div style={{ width:"100%", height:"100%", background:"repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 0 0/10px 10px", opacity:0.9, borderRadius:4 }} />
                  </div>
                )}
                <div style={{ fontSize:13, color:COLORS.textMuted, marginBottom:4 }}>Total Pembayaran</div>
                <div style={{ fontFamily:"'Cinzel', serif", fontSize:28, fontWeight:700, color:plan.color }}>{plan.price}</div>
                <div style={{ fontSize:12, color:COLORS.textDim, marginTop:4 }}>via {methods.find(m=>m.id===method)?.label}</div>
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <button className="btn-ghost" style={{ flex:1 }} onClick={() => setStep(1)}>← Kembali</button>
                <button className="btn-primary" style={{ flex:1 }} onClick={() => { setStep(3); setTimeout(onSuccess, 2000); }}>
                  Bayar Sekarang ✦
                </button>
              </div>
            </div>
          </>
        )}
        {step === 3 && (
          <div style={{ textAlign:"center", padding:20 }}>
            <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(74,222,128,0.2)", border:"2px solid rgba(74,222,128,0.5)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:36 }}>✓</div>
            <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:24, fontWeight:700, marginBottom:8, color:"#4ade80" }}>Pembayaran Berhasil!</h2>
            <p style={{ color:COLORS.textMuted, marginBottom:24 }}>Membership {plan.name} Anda telah aktif. Selamat belajar!</p>
            <div style={{ background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.3)", borderRadius:12, padding:16, marginBottom:20 }}>
              <div style={{ fontSize:13, color:COLORS.textMuted }}>Akses berlaku hingga</div>
              <div style={{ fontFamily:"'Cinzel', serif", fontSize:20, fontWeight:700, color:"#4ade80" }}>31 Februari 2025</div>
            </div>
            <div style={{ animation:"rotate 1s linear infinite", width:24, height:24, border:"2px solid rgba(74,222,128,0.3)", borderTop:"2px solid #4ade80", borderRadius:"50%", margin:"0 auto" }} />
            <div style={{ fontSize:13, color:COLORS.textMuted, marginTop:12 }}>Mengalihkan ke dashboard...</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CATALOG PAGE
// ============================================================
function CatalogPage({ setSelectedVideo, setPage }) {
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const categories = ["Semua","Filmmaking","Audio","VFX","Direction","Post-Production"];
  const filtered = MOCK_VIDEOS.filter(v =>
    (filter==="Semua" || v.category===filter) &&
    (v.title.toLowerCase().includes(search.toLowerCase()) || v.instructor.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div style={{ minHeight:"100vh", paddingTop:96, padding:"96px 24px 60px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <h1 style={{ fontFamily:"'Cinzel', serif", fontSize:36, fontWeight:700, marginBottom:8 }}>Katalog Video</h1>
        <p style={{ color:COLORS.textMuted, marginBottom:32 }}>Jelajahi koleksi masterclass premium kami</p>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:32 }}>
          <input className="input-field" placeholder="🔍 Cari video atau instruktur..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:300 }} />
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {categories.map(c=>(
              <button key={c} onClick={() => setFilter(c)} style={{ background:filter===c?"rgba(124,58,237,0.25)":"rgba(255,255,255,0.06)", border:`1px solid ${filter===c?"rgba(124,58,237,0.5)":"rgba(255,255,255,0.1)"}`, color:filter===c?COLORS.purpleLight:COLORS.textMuted, padding:"8px 16px", borderRadius:20, cursor:"pointer", fontSize:13, transition:"all 0.2s", fontFamily:"'DM Sans', sans-serif" }}>{c}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:24 }}>
          {filtered.map(v=>(
            <VideoCard key={v.id} video={v} onClick={() => { setSelectedVideo(v); setPage("player"); }} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:60, color:COLORS.textDim }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
            <div style={{ fontSize:18, fontWeight:600 }}>Tidak ada video ditemukan</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MEMBERSHIP PAGE (standalone)
// ============================================================
function MembershipPage({ setPage, user }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [notification, setNotification] = useState(null);

  return (
    <div style={{ minHeight:"100vh", paddingTop:96, padding:"96px 24px 80px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", textAlign:"center" }}>
        <div style={{ fontSize:13, color:COLORS.purple, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>BERLANGGANAN</div>
        <h1 style={{ fontFamily:"'Cinzel', serif", fontSize:48, fontWeight:700, marginBottom:16 }}>Pilih Paket Anda</h1>
        <p style={{ fontSize:16, color:COLORS.textMuted, maxWidth:500, margin:"0 auto 56px" }}>Buka akses ke ribuan video premium dari para maestro dunia</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(290px, 1fr))", gap:24, marginBottom:48 }}>
          {PLANS.map(plan=>(
            <MembershipCard key={plan.id} plan={plan} onSelect={p => { setSelectedPlan(p); if(user) setShowPayment(true); else setPage("register"); }} isSelected={selectedPlan?.id===plan.id} isCurrentPlan={user?.plan===plan.id} />
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:24, flexWrap:"wrap", color:COLORS.textDim, fontSize:13 }}>
          {["✓ Garansi 7 hari uang kembali","✓ Batalkan kapan saja","✓ Pembayaran aman via Midtrans","✓ QRIS tersedia"].map(t=><span key={t}>{t}</span>)}
        </div>
      </div>
      {showPayment && selectedPlan && (
        <PaymentModal plan={selectedPlan} onClose={() => setShowPayment(false)} onSuccess={() => { setShowPayment(false); setNotification("🎉 Membership berhasil diaktifkan!"); setPage("dashboard"); }} />
      )}
      {notification && <Notification message={notification} type="success" onClose={() => setNotification(null)} />}
    </div>
  );
}

// ============================================================
// ARCHITECTURE OVERVIEW PAGE
// ============================================================
function ArchitecturePage() {
  const sections = [
    {
      title: "📁 Struktur Folder Proyek",
      content: `streamvault/
├── frontend/                    # Next.js 15 + TypeScript
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── videos/[id]/page.tsx
│   │   │   └── membership/page.tsx
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   └── videos/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── VideoCard.tsx
│   │   │   ├── MembershipCard.tsx
│   │   │   ├── PlayerControls.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── PaymentModal.tsx
│   │   │   └── DashboardCard.tsx
│   │   ├── VideoPlayer.tsx
│   │   └── HLSPlayer.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCountdown.ts
│   │   └── useWatchProgress.ts
│   ├── store/              # Zustand state management
│   │   ├── authStore.ts
│   │   └── playerStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── tailwind.config.ts
│   └── next.config.ts
│
├── backend/                     # Node.js Express API
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── videoController.ts
│   │   │   ├── membershipController.ts
│   │   │   ├── paymentController.ts
│   │   │   └── adminController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── rateLimit.ts
│   │   │   └── deviceCheck.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── videos.ts
│   │   │   ├── membership.ts
│   │   │   └── admin.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Video.ts
│   │   │   └── Subscription.ts
│   │   ├── services/
│   │   │   ├── hlsService.ts
│   │   │   ├── midtransService.ts
│   │   │   └── emailService.ts
│   │   └── app.ts
│   └── prisma/
│       └── schema.prisma
│
├── docker-compose.yml
└── .env.example`
    },
    {
      title: "🗄️ Database Schema (MySQL)",
      content: `-- USERS TABLE
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  role ENUM('user','admin') DEFAULT 'user',
  google_id VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  referral_code VARCHAR(20) UNIQUE,
  referred_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- MEMBERSHIPS (plan definitions)
CREATE TABLE memberships (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration_days INT NOT NULL,
  access_hours INT NOT NULL,
  max_devices INT NOT NULL DEFAULT 1,
  features JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SUBSCRIPTIONS (user active plans)
CREATE TABLE subscriptions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  membership_id BIGINT NOT NULL,
  status ENUM('active','expired','suspended','cancelled') DEFAULT 'active',
  started_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  hours_total INT NOT NULL,
  hours_used DECIMAL(10,2) DEFAULT 0,
  auto_renew BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (membership_id) REFERENCES memberships(id),
  INDEX idx_user_status (user_id, status)
);

-- VIDEOS
CREATE TABLE videos (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  instructor VARCHAR(100),
  thumbnail VARCHAR(255),
  hls_url VARCHAR(500),
  duration_seconds INT,
  category_id BIGINT,
  access_level ENUM('free','basic','premium','vip') DEFAULT 'premium',
  is_published BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category_id),
  INDEX idx_access (access_level)
);

-- VIDEO CATEGORIES
CREATE TABLE video_categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WATCH HISTORY
CREATE TABLE watch_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  video_id BIGINT NOT NULL,
  progress_seconds INT DEFAULT 0,
  progress_percent DECIMAL(5,2) DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_video (user_id, video_id),
  INDEX idx_user_history (user_id)
);

-- WATCH TIME LOGS (for billing countdown)
CREATE TABLE watch_time_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  subscription_id BIGINT NOT NULL,
  video_id BIGINT NOT NULL,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  duration_seconds INT DEFAULT 0,
  INDEX idx_user_sub (user_id, subscription_id)
);

-- PAYMENTS
CREATE TABLE payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  subscription_id BIGINT,
  order_id VARCHAR(100) UNIQUE NOT NULL,
  gateway ENUM('midtrans','manual') NOT NULL,
  payment_method VARCHAR(50),
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending','success','failed','expired','refunded') DEFAULT 'pending',
  gateway_response JSON,
  paid_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_payments (user_id),
  INDEX idx_status (status)
);

-- FAVORITES
CREATE TABLE favorites (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  video_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_fav (user_id, video_id)
);

-- DEVICE SESSIONS
CREATE TABLE device_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  device_fingerprint VARCHAR(255) NOT NULL,
  device_name VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT,
  refresh_token VARCHAR(500),
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_user_device (user_id, is_active)
);`
    },
    {
      title: "🔌 REST API Endpoints",
      content: `# AUTH ROUTES
POST   /api/auth/register          # Register user baru
POST   /api/auth/login             # Login + JWT + refresh token
POST   /api/auth/logout            # Invalidate token
POST   /api/auth/refresh           # Refresh access token
POST   /api/auth/forgot-password   # Kirim email reset
POST   /api/auth/reset-password    # Reset dengan token
GET    /api/auth/verify/:token     # Verifikasi email
GET    /api/auth/google            # OAuth Google redirect
GET    /api/auth/google/callback   # OAuth callback

# VIDEO ROUTES (auth required)
GET    /api/videos                 # List video (dengan filter & pagination)
GET    /api/videos/:id             # Detail video
GET    /api/videos/:id/stream      # Tokenized HLS stream URL
GET    /api/videos/search          # Search video
GET    /api/videos/category/:slug  # Video by kategori
POST   /api/videos/:id/progress    # Update watch progress
GET    /api/videos/recommended     # AI recommendations

# MEMBERSHIP ROUTES
GET    /api/memberships            # List semua plan
GET    /api/membership/current     # Subscription aktif user
GET    /api/membership/history     # Riwayat subscription
GET    /api/membership/timer       # Sisa jam akses

# PAYMENT ROUTES
POST   /api/payments/create        # Buat transaksi Midtrans
POST   /api/payments/notification  # Webhook Midtrans
GET    /api/payments/status/:orderId
GET    /api/payments/history       # Riwayat pembayaran user
POST   /api/payments/apply-coupon  # Terapkan kupon diskon

# FAVORITES & HISTORY
GET    /api/favorites              # List favorit user
POST   /api/favorites/:videoId     # Tambah favorit
DELETE /api/favorites/:videoId     # Hapus favorit
GET    /api/watch-history          # Riwayat tonton

# ADMIN ROUTES (admin role required)
GET    /api/admin/dashboard        # Stats dashboard
GET    /api/admin/users            # List semua user
PUT    /api/admin/users/:id/ban    # Ban user
PUT    /api/admin/users/:id/plan   # Ubah plan user
POST   /api/admin/videos           # Upload video
PUT    /api/admin/videos/:id       # Edit video
DELETE /api/admin/videos/:id       # Hapus video
GET    /api/admin/payments         # Semua transaksi
GET    /api/admin/analytics        # Revenue & stats
GET    /api/admin/analytics/revenue  # Revenue chart data`
    },
    {
      title: "⚙️ tailwind.config.ts",
      content: `import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#050508', secondary: '#0a0a12' },
        purple: {
          DEFAULT: '#7c3aed', light: '#a855f7',
          glow: '#9333ea', neon: '#c084fc',
        },
        gold: '#f59e0b',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #050508 0%, #14082a 50%, #050508 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.08))',
        'purple-glow': 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'countdown': 'countdown-tick 1s ease-in-out infinite',
      },
      backdropBlur: { xl: '24px', '2xl': '40px' },
      boxShadow: {
        glow: '0 0 20px rgba(124,58,237,0.4)',
        'glow-lg': '0 0 40px rgba(124,58,237,0.6)',
        card: '0 8px 40px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
export default config`
    },
    {
      title: "🔐 Security & HLS Streaming",
      content: `// middleware/tokenizedStream.ts
// Generates time-limited signed URLs for HLS streaming

import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export const generateStreamToken = (userId: number, videoId: number) => {
  const payload = { userId, videoId, type: 'stream', exp: Math.floor(Date.now()/1000) + 3600 }
  return jwt.sign(payload, process.env.STREAM_SECRET!)
}

export const validateStreamToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.STREAM_SECRET!) as StreamPayload
  } catch { return null }
}

// Membership timer deduction middleware
export const deductWatchTime = async (req, res, next) => {
  const { user } = req
  const subscription = await Subscription.findActiveByUser(user.id)
  if (!subscription) return res.status(403).json({ error: 'No active subscription' })
  if (subscription.hours_used >= subscription.hours_total) {
    await subscription.update({ status: 'expired' })
    return res.status(403).json({ error: 'Access hours exhausted' })
  }
  // Start watching session
  const session = await WatchTimeLog.create({
    user_id: user.id, subscription_id: subscription.id,
    video_id: req.params.videoId, started_at: new Date()
  })
  req.watchSession = session
  // Auto-deduct on disconnect via SSE heartbeat
  next()
}

// Device limit check
export const checkDeviceLimit = async (req, res, next) => {
  const { user } = req
  const membership = await user.getActiveMembership()
  const activeDevices = await DeviceSession.countActive(user.id)
  if (activeDevices >= membership.max_devices) {
    return res.status(403).json({ error: 'Device limit reached', code: 'DEVICE_LIMIT' })
  }
  next()
}

// HLS URL signing (prevent direct download)
export const signHLSUrl = (baseUrl: string, userId: number): string => {
  const expires = Math.floor(Date.now()/1000) + 3600
  const hash = crypto.createHmac('sha256', process.env.HLS_SECRET!)
    .update(\`\${userId}:\${expires}:\${baseUrl}\`)
    .digest('hex')
  return \`\${baseUrl}?token=\${hash}&exp=\${expires}&uid=\${userId}\`
}`
    },
    {
      title: "🐳 Docker + Environment Setup",
      content: `# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ['3000:3000']
    environment:
      - NEXT_PUBLIC_API_URL=http://api:8000
    depends_on: [api]

  api:
    build: ./backend
    ports: ['8000:8000']
    environment:
      - DATABASE_URL=mysql://root:secret@db:3306/streamvault
      - JWT_SECRET=your_jwt_secret_here
      - STREAM_SECRET=your_stream_secret_here
      - MIDTRANS_SERVER_KEY=your_midtrans_key
      - MIDTRANS_CLIENT_KEY=your_midtrans_client_key
      - GOOGLE_CLIENT_ID=your_google_client_id
      - GOOGLE_CLIENT_SECRET=your_google_client_secret
      - MAIL_HOST=smtp.mailtrap.io
      - REDIS_URL=redis://redis:6379
    depends_on: [db, redis]

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: streamvault
    volumes:
      - mysql_data:/var/lib/mysql
    ports: ['3306:3306']

  redis:
    image: redis:7-alpine
    ports: ['6379:6379']

  nginx:
    image: nginx:alpine
    ports: ['80:80', '443:443']
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on: [frontend, api]

volumes:
  mysql_data:

# .env.example
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
DATABASE_URL=mysql://root:secret@localhost:3306/streamvault
JWT_SECRET=change_me_to_random_256bit_secret
JWT_REFRESH_SECRET=change_me_to_random_secret
STREAM_SECRET=change_me_hls_signing_secret
HLS_SECRET=change_me_hls_url_signing
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
REDIS_URL=redis://localhost:6379
AWS_S3_BUCKET=streamvault-videos
AWS_REGION=ap-southeast-1`
    }
  ];

  return (
    <div style={{ minHeight:"100vh", paddingTop:96, padding:"96px 24px 60px", maxWidth:1000, margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <span className="badge badge-premium" style={{ marginBottom:16, display:"inline-block" }}>DOKUMENTASI TEKNIS</span>
        <h1 style={{ fontFamily:"'Cinzel', serif", fontSize:40, fontWeight:700, marginBottom:12 }}>Arsitektur & Kode</h1>
        <p style={{ color:COLORS.textMuted, fontSize:16 }}>Full-stack architecture, schema database, dan panduan deployment</p>
      </div>
      {sections.map((s,i) => (
        <div key={i} className="glass-card" style={{ marginBottom:20, overflow:"hidden" }}>
          <div style={{ padding:"20px 24px", background:"rgba(124,58,237,0.08)", borderBottom:"1px solid rgba(124,58,237,0.2)" }}>
            <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:18, fontWeight:700 }}>{s.title}</h2>
          </div>
          <div style={{ padding:24 }}>
            <pre style={{ fontFamily:"'Courier New', monospace", fontSize:"clamp(10px, 1.5vw, 13px)", color:COLORS.accent, lineHeight:1.7, overflowX:"auto", whiteSpace:"pre-wrap", wordBreak:"break-all" }}>
              {s.content}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [notification, setNotification] = useState(null);

  const notify = useCallback((msg, type="success") => {
    setNotification({ msg, type });
  }, []);

  const handleSetSelectedVideo = useCallback((video) => {
    setSelectedVideo(video);
    if (video) setPage("player");
  }, []);

  const showPlayerDirectly = selectedVideo && page === "player";

  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight:"100vh", background:`linear-gradient(180deg, ${COLORS.bg} 0%, ${COLORS.bgSecondary} 100%)` }}>
        <Navbar page={page} setPage={setPage} user={user} setUser={setUser} />

        {notification && (
          <Notification message={notification.msg} type={notification.type} onClose={() => setNotification(null)} />
        )}

        {page === "home" && <LandingPage setPage={setPage} setSelectedVideo={handleSetSelectedVideo} />}
        {page === "login" && <AuthPage type="login" setPage={setPage} setUser={setUser} />}
        {page === "register" && <AuthPage type="register" setPage={setPage} setUser={setUser} />}
        {page === "forgot" && <AuthPage type="forgot" setPage={setPage} setUser={setUser} />}
        {page === "catalog" && <CatalogPage setSelectedVideo={handleSetSelectedVideo} setPage={setPage} />}
        {page === "membership" && <MembershipPage setPage={setPage} user={user} />}
        {page === "dashboard" && <Dashboard user={user || { name:"Demo User", email:"demo@streamvault.id", plan:"premium" }} setPage={setPage} setSelectedVideo={handleSetSelectedVideo} />}
        {page === "player" && <VideoPlayer video={selectedVideo || MOCK_VIDEOS[0]} setPage={setPage} />}
        {page === "admin" && <AdminPanel setPage={setPage} />}
        {page === "architecture" && <ArchitecturePage />}

        {/* Quick Nav for Demo */}
        <div style={{ position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)", display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", zIndex:500, maxWidth:"95vw" }}>
          {[
            { label:"🏠 Home", p:"home" },
            { label:"📽 Catalog", p:"catalog" },
            { label:"✦ Plans", p:"membership" },
            { label:"🎬 Player", p:"player" },
            { label:"📊 Dashboard", p:"dashboard" },
            { label:"⚙ Admin", p:"admin" },
            { label:"📐 Architecture", p:"architecture" },
          ].map(({label,p}) => (
            <button key={p} onClick={() => setPage(p)} style={{
              background: page===p ? "rgba(124,58,237,0.85)" : "rgba(5,5,8,0.92)",
              border: `1px solid ${page===p ? "rgba(168,85,247,0.7)" : "rgba(124,58,237,0.3)"}`,
              color: page===p ? "white" : COLORS.textMuted,
              padding:"8px 14px",
              borderRadius:20,
              cursor:"pointer",
              fontSize:"clamp(10px, 2vw, 12px)",
              fontFamily:"'DM Sans', sans-serif",
              fontWeight:500,
              backdropFilter:"blur(12px)",
              transition:"all 0.2s",
              whiteSpace:"nowrap",
            }}>{label}</button>
          ))}
        </div>
      </div>
    </>
  );
}
