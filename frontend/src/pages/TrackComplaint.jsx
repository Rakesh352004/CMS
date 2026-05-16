import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FONT_LINK = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .tc-root {
    min-height: calc(100vh - 62px);
    background: #07080C;
    font-family: 'Syne', sans-serif;
    color: #E8E6E0;
    position: relative;
    overflow: hidden;
  }

  .tc-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,212,184,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,184,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .tc-root::after {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,184,0.07) 0%, transparent 70%);
    top: -180px;
    right: -180px;
    pointer-events: none;
    z-index: 0;
  }

  .tc-glow-bl {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,184,0.05) 0%, transparent 70%);
    bottom: -150px;
    left: -150px;
    pointer-events: none;
    z-index: 0;
  }

  .tc-main {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 56px 48px 80px;
  }

  /* ── header ── */
  .tc-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 44px;
    animation: fadeUp 0.5s 0.1s ease both;
    flex-wrap: wrap;
  }

  .tc-header-left {}

  .tc-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #00D4B8;
    margin-bottom: 10px;
  }

  .tc-heading {
    font-size: 34px;
    font-weight: 800;
    line-height: 1.12;
    color: #F0EEE8;
    letter-spacing: -0.025em;
    margin-bottom: 8px;
  }

  .tc-subheading {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #5A5F6E;
    font-weight: 300;
    line-height: 1.65;
    max-width: 480px;
  }

  .tc-btn-new {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px;
    background: linear-gradient(135deg, #00D4B8 0%, #00A896 100%);
    color: #07080C;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.02em;
    border-radius: 9px;
    text-decoration: none;
    white-space: nowrap;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(0,212,184,0.25);
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: 4px;
  }

  .tc-btn-new:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(0,212,184,0.35);
  }

  /* ── stat cards ── */
  .tc-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 36px;
  }

  .tc-stat {
    background: rgba(12,13,19,0.8);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 22px 24px;
    backdrop-filter: blur(10px);
    animation: fadeUp 0.5s ease both;
    position: relative;
    overflow: hidden;
  }

  .tc-stat::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,212,184,0.04) 0%, transparent 60%);
    pointer-events: none;
  }

  .tc-stat:nth-child(1) { animation-delay: 0.15s; }
  .tc-stat:nth-child(2) { animation-delay: 0.22s; }
  .tc-stat:nth-child(3) { animation-delay: 0.29s; }

  .tc-stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #5A5F6E;
    margin-bottom: 10px;
  }

  .tc-stat-num {
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .tc-stat-num-teal   { color: #00D4B8; }
  .tc-stat-num-amber  { color: #FFB432; }
  .tc-stat-num-green  { color: #50C878; }

  .tc-stat-icon {
    position: absolute;
    top: 18px;
    right: 20px;
    opacity: 0.15;
  }

  /* ── list section ── */
  .tc-section {
    background: rgba(12,13,19,0.8);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    overflow: hidden;
    animation: fadeUp 0.5s 0.35s ease both;
  }

  .tc-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 26px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .tc-controls {
    display: grid;
    gap: 16px;
    padding: 20px 26px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
  }

  .tc-search-wrapper {
    width: 100%;
  }

  .tc-search {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 12px 16px;
    color: #E8E6E0;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    outline: none;
  }

  .tc-search::placeholder {
    color: #5A5F6E;
  }

  .tc-filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .tc-filter-chip {
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #A0A5B5;
    border-radius: 999px;
    padding: 10px 14px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tc-filter-chip.active {
    border-color: rgba(0,212,184,0.4);
    color: #00D4B8;
    background: rgba(0,212,184,0.12);
  }

  .tc-sort-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .tc-sort-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #5A5F6E;
  }

  .tc-section-title {
    font-size: 15px;
    font-weight: 700;
    color: #E8E6E0;
    letter-spacing: -0.01em;
  }

  .tc-count-badge {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 99px;
    background: rgba(0,212,184,0.1);
    border: 1px solid rgba(0,212,184,0.2);
    color: #00D4B8;
    letter-spacing: 0.06em;
  }

  /* ── loading / empty ── */
  .tc-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 60px 24px;
    color: #3A3F4E;
  }

  .tc-state-icon { opacity: 0.4; }

  .tc-state-text {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: #5A5F6E;
    text-align: center;
    line-height: 1.6;
  }

  .tc-state-link {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #00D4B8;
    text-decoration: none;
    padding: 8px 18px;
    border: 1px solid rgba(0,212,184,0.25);
    border-radius: 8px;
    transition: background 0.2s;
  }
  .tc-state-link:hover { background: rgba(0,212,184,0.07); }

  /* spinner */
  .tc-spinner {
    width: 28px;
    height: 28px;
    border: 2px solid rgba(0,212,184,0.15);
    border-top-color: #00D4B8;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  /* ── complaint row ── */
  .tc-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    padding: 22px 26px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: background 0.2s;
  }

  .tc-item:last-child { border-bottom: none; }
  .tc-item:hover { background: rgba(255,255,255,0.02); }

  .tc-item-left { flex: 1; min-width: 0; text-decoration: none; color: inherit; }

  .tc-item-top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }

  .tc-item-title {
    font-size: 14px;
    font-weight: 700;
    color: #E8E6E0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tc-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 99px;
    letter-spacing: 0.06em;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .tc-badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .badge-open     { background: rgba(255,180,50,0.12);  color: #FFB432; border: 1px solid rgba(255,180,50,0.2); }
  .badge-progress { background: rgba(0,212,184,0.12);   color: #00D4B8; border: 1px solid rgba(0,212,184,0.2); }
  .badge-resolved { background: rgba(80,200,120,0.12);  color: #50C878; border: 1px solid rgba(80,200,120,0.2); }
  .badge-closed   { background: rgba(100,100,120,0.12); color: #7A7F8E; border: 1px solid rgba(100,100,120,0.2); }

  .dot-open     { background: #FFB432; }
  .dot-progress { background: #00D4B8; }
  .dot-resolved { background: #50C878; }
  .dot-closed   { background: #7A7F8E; }

  .tc-item-desc {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #5A5F6E;
    line-height: 1.65;
    font-weight: 300;
    margin-bottom: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tc-item-meta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .tc-meta-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: #3A3F4E;
    letter-spacing: 0.04em;
  }

  /* delete button */
  .tc-btn-delete {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.15);
    border-radius: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #EF4444;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: 2px;
  }

  .tc-btn-delete:hover {
    background: rgba(239,68,68,0.15);
    border-color: rgba(239,68,68,0.3);
  }

  .tc-btn-delete:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* ── keyframes ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── responsive ── */
  @media (max-width: 640px) {
    .tc-main { padding: 36px 20px 60px; }
    .tc-heading { font-size: 26px; }
    .tc-stats { grid-template-columns: 1fr; }
    .tc-item { flex-direction: column; gap: 14px; }
    .tc-btn-delete { align-self: flex-start; }
  }
`;

/* ─── SVG icons ─────────────────────────────────────────────────────────── */
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconInbox = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
    <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
  </svg>
);

const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
);

const IconTotal = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IconPending = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconResolved = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IconDept = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M9 3v18M3 9h18M3 15h18"/>
  </svg>
);

const IconCal = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

/* ─── helpers ─────────────────────────────────────────────────────────── */
const statusConfig = (status = '') => {
  const s = status.toLowerCase();
  if (s === 'resolved') return { cls: 'badge-resolved', dot: 'dot-resolved', label: 'Resolved' };
  if (s === 'in progress' || s === 'inprogress') return { cls: 'badge-progress', dot: 'dot-progress', label: 'In Progress' };
  if (s === 'closed') return { cls: 'badge-closed', dot: 'dot-closed', label: 'Closed' };
  return { cls: 'badge-open', dot: 'dot-open', label: status || 'Open' };
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

/* ─── component ─────────────────────────────────────────────────────────── */
const TrackComplaint = () => {
  const [complaints, setComplaints]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [deletingId, setDeletingId]   = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const fetchComplaints = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/complaint/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const deleteComplaint = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/complaint/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredComplaints = complaints
    .filter((complaint) => {
      if (filterStatus === 'All') return true;
      const normalized = complaint.status?.toLowerCase() || 'pending';
      const statusValue = normalized === 'pending' || normalized === 'open' ? 'Open' : normalized === 'in progress' || normalized === 'inprogress' ? 'In Progress' : normalized === 'resolved' ? 'Resolved' : normalized === 'closed' ? 'Closed' : complaint.status;
      return statusValue === filterStatus;
    })
    .filter((complaint) => {
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      return (
        complaint.title?.toLowerCase().includes(query) ||
        complaint.description?.toLowerCase().includes(query) ||
        complaint._id?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const totalCount    = complaints.length;
  const pendingCount  = complaints.filter((c) => c.status?.toLowerCase() === 'pending' || c.status?.toLowerCase() === 'open').length;
  const resolvedCount = complaints.filter((c) => c.status?.toLowerCase() === 'resolved').length;

  return (
    <>
      <style>{FONT_LINK}</style>
      <style>{CSS}</style>

      <div className="tc-root">
        <div className="tc-glow-bl" />

        <main className="tc-main">

          {/* ── Header ── */}
          <div className="tc-header">
            <div className="tc-header-left">
              <p className="tc-eyebrow">// my complaints</p>
              <h1 className="tc-heading">Track Complaints</h1>
              <p className="tc-subheading">
                View the latest status of your submitted complaints and act on any unresolved items.
              </p>
            </div>
            <Link to="/submit-complaint" className="tc-btn-new">
              <IconPlus /> New complaint
            </Link>
          </div>

          {/* ── Stats ── */}
          <div className="tc-stats">
            <div className="tc-stat">
              <div className="tc-stat-icon"><IconTotal /></div>
              <p className="tc-stat-label">Total Submitted</p>
              <p className={`tc-stat-num tc-stat-num-teal`}>{totalCount}</p>
            </div>
            <div className="tc-stat">
              <div className="tc-stat-icon"><IconPending /></div>
              <p className="tc-stat-label">Pending</p>
              <p className={`tc-stat-num tc-stat-num-amber`}>{pendingCount}</p>
            </div>
            <div className="tc-stat">
              <div className="tc-stat-icon"><IconResolved /></div>
              <p className="tc-stat-label">Resolved</p>
              <p className={`tc-stat-num tc-stat-num-green`}>{resolvedCount}</p>
            </div>
          </div>

          {/* ── List ── */}
          <div className="tc-section">
            <div className="tc-section-header">
              <span className="tc-section-title">My Complaints</span>
              {!loading && <span className="tc-count-badge">{filteredComplaints.length} matching</span>}
            </div>

            <div className="tc-controls">
              <div className="tc-search-wrapper">
                <input
                  type="search"
                  className="tc-search"
                  placeholder="Search by title, description, or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="tc-filter-row">
                {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                  <button
                    key={status}
                    className={`tc-filter-chip ${filterStatus === status ? 'active' : ''}`}
                    onClick={() => setFilterStatus(status)}
                    type="button"
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className="tc-sort-wrapper">
                <label className="tc-sort-label">Sort:</label>
                <select className="tc-search" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="tc-state">
                <div className="tc-spinner" />
                <p className="tc-state-text">Loading your complaints…</p>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="tc-state">
                <div className="tc-state-icon"><IconInbox /></div>
                <p className="tc-state-text">
                  No complaints match your current search or status filter.<br />Try a different filter or submit a new complaint.
                </p>
                <Link to="/submit-complaint" className="tc-state-link">File a complaint →</Link>
              </div>
            ) : (
              filteredComplaints.map((complaint) => {
                const { cls, dot, label } = statusConfig(complaint.status);
                return (
                  <div key={complaint._id} className="tc-item">
                    <Link to={`/complaint/${complaint._id}`} className="tc-item-left">
                      <div className="tc-item-top">
                        <span className="tc-item-title">{complaint.title}</span>
                        <span className={`tc-badge ${cls}`}>
                          <span className={`tc-badge-dot ${dot}`} />
                          {label}
                        </span>
                      </div>
                      {complaint.description && (
                        <p className="tc-item-desc">{complaint.description}</p>
                      )}
                      <div className="tc-item-meta">
                        {complaint.location && (
                          <span className="tc-meta-chip">
                            <IconDept /> {complaint.location}
                          </span>
                        )}
                        {complaint.category && (
                          <span className="tc-meta-chip">
                            <IconDept /> {complaint.category}
                          </span>
                        )}
                        {complaint.priority && (
                          <span className="tc-meta-chip">
                            <IconCal /> Priority: {complaint.priority}
                          </span>
                        )}
                        {complaint.createdAt && (
                          <span className="tc-meta-chip">
                            <IconCal /> {formatDate(complaint.createdAt)}
                          </span>
                        )}
                      </div>
                    </Link>

                    <button
                      className="tc-btn-delete"
                      onClick={() => deleteComplaint(complaint._id)}
                      disabled={deletingId === complaint._id}
                    >
                      <IconTrash />
                      {deletingId === complaint._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                );
              })
            )}
          </div>

        </main>
      </div>
    </>
  );
};

export default TrackComplaint;