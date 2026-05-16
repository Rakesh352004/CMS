import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function parseTokenPayload(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    return null;
  }
}

const FONT_LINK = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .home-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #07080C;
    font-family: 'Syne', sans-serif;
    color: #E8E6E0;
    position: relative;
    overflow: hidden;
    padding: 60px 24px;
  }

  /* grid texture */
  .home-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,212,184,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,184,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  /* glow orb top-right */
  .home-root::after {
    content: '';
    position: absolute;
    width: 700px;
    height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,184,0.08) 0%, transparent 70%);
    top: -200px;
    right: -200px;
    pointer-events: none;
  }

  /* glow orb bottom-left */
  .home-glow-bl {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,184,0.06) 0%, transparent 70%);
    bottom: -200px;
    left: -200px;
    pointer-events: none;
  }

  /* ── hero ── */
  .hero {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 680px;
    margin-bottom: 72px;
  }

  .hero-eyebrow {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #00D4B8;
    margin-bottom: 18px;
    animation: fadeUp 0.5s 0.1s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }

  .hero-title {
    font-size: clamp(44px, 7vw, 72px);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.03em;
    color: #F0EEE8;
    margin-bottom: 20px;
    animation: fadeUp 0.5s 0.18s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }

  .hero-title span {
    background: linear-gradient(135deg, #00D4B8, #00A896);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-desc {
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    font-weight: 300;
    color: #5A5F6E;
    line-height: 1.75;
    max-width: 520px;
    margin: 0 auto 38px;
    animation: fadeUp 0.5s 0.26s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }

  /* auth buttons */
  .hero-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
    animation: fadeUp 0.5s 0.34s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }

  .btn-primary {
    padding: 13px 32px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #00D4B8 0%, #00A896 100%);
    color: #07080C;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.03em;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(0,212,184,0.28);
    text-decoration: none;
    display: inline-block;
  }
  .btn-primary:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(0,212,184,0.38);
  }
  .btn-primary:active { transform: translateY(0); }

  .btn-outline {
    padding: 13px 32px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    background: rgba(255,255,255,0.035);
    color: #E8E6E0;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
    text-decoration: none;
    display: inline-block;
  }
  .btn-outline:hover {
    border-color: rgba(0,212,184,0.35);
    background: rgba(0,212,184,0.05);
    transform: translateY(-1px);
  }
  .btn-outline:active { transform: translateY(0); }

  /* ── divider ── */
  .section-divider {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    max-width: 640px;
    margin-bottom: 40px;
    animation: fadeUp 0.5s 0.42s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }
  .section-divider::before, .section-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }
  .section-divider span {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.12em;
    color: #3A3F4E;
    text-transform: uppercase;
  }

  /* ── feature cards ── */
  .cards-row {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
    width: 100%;
    max-width: 760px;
  }

  .card {
    flex: 1 1 300px;
    max-width: 340px;
    padding: 36px 32px;
    background: rgba(12,13,19,0.85);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    backdrop-filter: blur(12px);
    cursor: pointer;
    transition: border-color 0.25s, transform 0.2s, box-shadow 0.25s;
    text-align: left;
    animation: fadeUp 0.5s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }
  .card:nth-child(1) { animation-delay: 0.5s; }
  .card:nth-child(2) { animation-delay: 0.58s; }

  .card:hover {
    border-color: rgba(0,212,184,0.25);
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,212,184,0.1);
  }

  .card-icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(0,212,184,0.1);
    border: 1px solid rgba(0,212,184,0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 22px;
    transition: background 0.2s;
  }
  .card:hover .card-icon-wrap {
    background: rgba(0,212,184,0.16);
  }

  .card-tag {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #00D4B8;
    margin-bottom: 10px;
  }

  .card-title {
    font-size: 20px;
    font-weight: 700;
    color: #F0EEE8;
    letter-spacing: -0.01em;
    margin-bottom: 10px;
  }

  .card-desc {
    font-family: 'DM Mono', monospace;
    font-size: 12.5px;
    font-weight: 300;
    color: #5A5F6E;
    line-height: 1.7;
  }

  .card-arrow {
    margin-top: 22px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #00D4B8;
    opacity: 0;
    transform: translateX(-4px);
    transition: opacity 0.2s, transform 0.2s;
  }
  .card:hover .card-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  .info-section {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 980px;
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(3, minmax(220px, 1fr));
    margin-top: 48px;
    animation: fadeUp 0.5s 0.58s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }

  .info-card {
    padding: 28px 24px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    backdrop-filter: blur(12px);
    color: #E8E6E0;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .info-card h3 {
    font-size: 18px;
    margin-bottom: 12px;
    color: #F0EEE8;
  }

  .info-card p {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: #A0A5B5;
    line-height: 1.75;
  }

  .info-card strong {
    color: #00D4B8;
  }

  /* keyframes */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* responsive */
  @media (max-width: 600px) {
    .hero { margin-bottom: 52px; }
    .hero-title { font-size: 38px; }
    .cards-row { gap: 16px; }
    .card { padding: 28px 24px; }
  }
`;

/* SVG icons */
const IconSubmit = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00D4B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12l7-7 7 7"/>
  </svg>
);

const IconTrack = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00D4B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const IconArrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

function Home() {
  const { darkMode } = useContext(ThemeContext);
  const token = localStorage.getItem("token");
  const validToken = token ? parseTokenPayload(token) : null;

  const handleSubmitComplaints = () => {
    if (!validToken) {
      localStorage.setItem("userLogin", "true");
      window.location.href = "/login";
      return;
    }

    const decoded = JSON.parse(atob(token.split(".")[1]));
    if (decoded.role === "admin") {
      alert("Admins cannot submit complaints");
      return;
    }
    window.location.href = "/submit-complaint";
  };

  const handleTrackStatus = () => {
    if (!validToken) {
      localStorage.setItem("userLogin", "true");
      window.location.href = "/login";
      return;
    }

    const decoded = JSON.parse(atob(token.split(".")[1]));
    if (decoded.role === "admin") {
      alert("Admins do not have complaint tracking");
      return;
    }
    window.location.href = "/track-complaint";
  };

  return (
    <>
      <style>{FONT_LINK}</style>
      <style>{CSS}</style>

      <div className="home-root">
        <div className="home-glow-bl" />

        {/* Hero */}
        <div className="hero">
          <p className="hero-eyebrow">// complaint management system</p>
          <h1 className="hero-title">
            Resolve issues,<br />
            <span>faster than ever.</span>
          </h1>
          <p className="hero-desc">
            Submit tickets, track your complaints in real-time, and stay updated at every step of the resolution process.
          </p>

          {!token && (
            <div className="hero-actions">
              <Link to="/login" className="btn-primary">Sign In</Link>
              <Link to="/register" className="btn-outline">Create Account</Link>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="section-divider">
          <span>what you can do</span>
        </div>

        {/* Feature Cards */}
        <div className="cards-row">

          <div className="card" onClick={handleSubmitComplaints}>
            <div className="card-icon-wrap">
              <IconSubmit />
            </div>
            <p className="card-tag">// raise a ticket</p>
            <h2 className="card-title">Submit Complaints</h2>
            <p className="card-desc">Easily raise issues in seconds. Describe your problem and let us handle the rest with full transparency.</p>
            <div className="card-arrow">
                Go to submit page <IconArrow />
              </div>
            </div>

            <div className="card" onClick={handleTrackStatus}>
              <div className="card-icon-wrap">
                <IconTrack />
              </div>
              <p className="card-tag">// live updates</p>
              <h2 className="card-title">Track Status</h2>
              <p className="card-desc">Monitor the progress of your complaints in real-time. Know exactly where things stand at every moment.</p>
              <div className="card-arrow">
                View tracking page <IconArrow />
              </div>
            </div>

          </div>

          <div className="info-section">
            <div className="info-card">
              <div>
                <h3>Clear & Simple</h3>
                <p>Submit complaints with a few clicks, attach details, and receive confirmation instantly. The process is designed for clarity and speed.</p>
              </div>
              <strong>Fast filing</strong>
            </div>

            <div className="info-card">
              <div>
                <h3>Keep Track</h3>
                <p>Track every complaint from registration to resolution. You always know when an update is available and what happens next.</p>
              </div>
              <strong>Transparent process</strong>
            </div>

            <div className="info-card">
              <div>
                <h3>Trusted Support</h3>
                <p>Built for communities and organizations that value accountability. Support teams can respond faster and communicate status clearly.</p>
              </div>
              <strong>Reliable outcomes</strong>
            </div>
          </div>
        </div>
      </>
  );
}

export default Home;