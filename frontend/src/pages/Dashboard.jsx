import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ThemeContext } from "../context/ThemeContext";

const FONT_LINK = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dash-root {
    min-height: calc(100vh - 62px);
    background: #07080C;
    font-family: 'Syne', sans-serif;
    color: #E8E6E0;
    position: relative;
    overflow: hidden;
  }

  .dash-root::before {
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

  .dash-main {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 56px 48px 80px;
  }

  .dash-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 48px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .dash-title {
    font-size: 36px;
    font-weight: 800;
    color: #F0EEE8;
    letter-spacing: -0.025em;
  }

  .dash-subtitle {
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    color: #5A5F6E;
    margin-top: 8px;
  }

  .dash-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .dash-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #00D4B8 0%, #00A896 100%);
    color: #07080C;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: opacity 0.2s, transform 0.15s;
  }

  .dash-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .dash-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
  }

  .dash-card {
    background: rgba(12,13,19,0.8);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 24px;
    backdrop-filter: blur(10px);
  }

  .dash-card-title {
    font-size: 18px;
    font-weight: 700;
    color: #F0EEE8;
    margin-bottom: 16px;
  }

  .dash-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .dash-stat {
    text-align: center;
  }

  .dash-stat-num {
    font-size: 32px;
    font-weight: 800;
    color: #00D4B8;
    display: block;
  }

  .dash-stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #5A5F6E;
    margin-top: 4px;
  }

  .dash-chart {
    height: 200px;
    display: flex;
    align-items: end;
    justify-content: space-around;
    gap: 8px;
  }

  .dash-bar {
    flex: 1;
    background: rgba(0,212,184,0.2);
    border-radius: 4px 4px 0 0;
    position: relative;
    min-height: 20px;
    transition: height 0.5s;
  }

  .dash-bar-fill {
    background: linear-gradient(to top, #00D4B8, #00A896);
    border-radius: 4px 4px 0 0;
    width: 100%;
    position: absolute;
    bottom: 0;
  }

  .dash-bar-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: #A0A5B5;
    text-align: center;
    margin-top: 8px;
  }

  .dash-recent {
    background: rgba(12,13,19,0.8);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 24px;
    backdrop-filter: blur(10px);
  }

  .dash-recent-title {
    font-size: 20px;
    font-weight: 700;
    color: #F0EEE8;
    margin-bottom: 20px;
  }

  .dash-recent-list {
    display: grid;
    gap: 12px;
  }

  .dash-recent-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: rgba(255,255,255,0.02);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.05);
    transition: background 0.2s;
  }

  .dash-recent-item:hover {
    background: rgba(255,255,255,0.04);
  }

  .dash-recent-left {
    flex: 1;
  }

  .dash-recent-title {
    font-size: 14px;
    font-weight: 600;
    color: #E8E6E0;
    margin-bottom: 4px;
  }

  .dash-recent-meta {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #5A5F6E;
  }

  .dash-recent-status {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    padding: 4px 10px;
    border-radius: 99px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .status-pending { background: rgba(255,180,50,0.12); color: #FFB432; }
  .status-progress { background: rgba(0,212,184,0.12); color: #00D4B8; }
  .status-resolved { background: rgba(80,200,120,0.12); color: #50C878; }

  @media (max-width: 768px) {
    .dash-main { padding: 36px 20px 60px; }
    .dash-title { font-size: 28px; }
    .dash-grid { grid-template-columns: 1fr; }
    .dash-stats { grid-template-columns: 1fr; }
  }
`;

function Dashboard() {
  const { darkMode } = useContext(ThemeContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/complaint/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status?.toLowerCase() === 'pending' || c.status?.toLowerCase() === 'open').length;
  const resolvedComplaints = complaints.filter(c => c.status?.toLowerCase() === 'resolved').length;
  const inProgressComplaints = complaints.filter(c => c.status?.toLowerCase() === 'in progress' || c.status?.toLowerCase() === 'inprogress').length;

  const recentComplaints = complaints.slice(0, 5);

  const statusData = [
    { label: 'Pending', count: pendingComplaints, max: totalComplaints },
    { label: 'In Progress', count: inProgressComplaints, max: totalComplaints },
    { label: 'Resolved', count: resolvedComplaints, max: totalComplaints },
  ];

  return (
    <>
      <style>{FONT_LINK}</style>
      <style>{CSS}</style>

      <div className="dash-root">
        <div className="dash-main">
          <div className="dash-header">
            <div>
              <h1 className="dash-title">Dashboard</h1>
              <p className="dash-subtitle">Overview of your complaint activity</p>
            </div>
            <div className="dash-actions">
              <Link to="/submit-complaint" className="dash-btn">
                <IconPlus /> New Complaint
              </Link>
              <Link to="/track-complaint" className="dash-btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#E8E6E0' }}>
                View All
              </Link>
            </div>
          </div>

          <div className="dash-grid">
            <div className="dash-card">
              <h2 className="dash-card-title">Quick Stats</h2>
              <div className="dash-stats">
                <div className="dash-stat">
                  <span className="dash-stat-num">{totalComplaints}</span>
                  <span className="dash-stat-label">Total</span>
                </div>
                <div className="dash-stat">
                  <span className="dash-stat-num">{pendingComplaints}</span>
                  <span className="dash-stat-label">Pending</span>
                </div>
                <div className="dash-stat">
                  <span className="dash-stat-num">{inProgressComplaints}</span>
                  <span className="dash-stat-label">In Progress</span>
                </div>
                <div className="dash-stat">
                  <span className="dash-stat-num">{resolvedComplaints}</span>
                  <span className="dash-stat-label">Resolved</span>
                </div>
              </div>
            </div>

            <div className="dash-card">
              <h2 className="dash-card-title">Status Distribution</h2>
              <div className="dash-chart">
                {statusData.map((item, index) => (
                  <div key={index} className="dash-bar" style={{ height: '100%' }}>
                    <div
                      className="dash-bar-fill"
                      style={{ height: item.max > 0 ? `${(item.count / item.max) * 100}%` : '0%' }}
                    />
                    <div className="dash-bar-label">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dash-recent">
            <h2 className="dash-recent-title">Recent Complaints</h2>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#5A5F6E' }}>Loading...</div>
            ) : recentComplaints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#5A5F6E' }}>
                No complaints yet. <Link to="/submit-complaint" style={{ color: '#00D4B8' }}>Submit your first one</Link>.
              </div>
            ) : (
              <div className="dash-recent-list">
                {recentComplaints.map((complaint) => {
                  const statusClass = complaint.status?.toLowerCase().replace(' ', '') || 'pending';
                  return (
                    <div key={complaint._id} className="dash-recent-item">
                      <div className="dash-recent-left">
                        <div className="dash-recent-title">{complaint.title}</div>
                        <div className="dash-recent-meta">
                          {complaint.category} • {new Date(complaint.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`dash-recent-status status-${statusClass}`}>
                        {complaint.status || 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default Dashboard;