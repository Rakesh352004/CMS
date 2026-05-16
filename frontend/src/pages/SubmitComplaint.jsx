import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const FONT_LINK = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sc-root {
    min-height: calc(100vh - 62px);
    background: #07080C;
    font-family: 'Syne', sans-serif;
    color: #E8E6E0;
    position: relative;
    overflow: hidden;
  }

  .sc-root::before {
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

  .sc-root::after {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,184,0.07) 0%, transparent 70%);
    top: -180px;
    left: -180px;
    pointer-events: none;
    z-index: 0;
  }

  .sc-glow-br {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,184,0.05) 0%, transparent 70%);
    bottom: -150px;
    right: -150px;
    pointer-events: none;
    z-index: 0;
  }

  .sc-main {
    position: relative;
    z-index: 1;
    max-width: 760px;
    margin: 0 auto;
    padding: 56px 48px 80px;
  }

  /* ── header ── */
  .sc-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 44px;
    animation: fadeUp 0.5s 0.1s ease both;
    flex-wrap: wrap;
  }

  .sc-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #00D4B8;
    margin-bottom: 10px;
  }

  .sc-heading {
    font-size: 34px;
    font-weight: 800;
    line-height: 1.12;
    color: #F0EEE8;
    letter-spacing: -0.025em;
    margin-bottom: 8px;
  }

  .sc-subheading {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #5A5F6E;
    font-weight: 300;
    line-height: 1.65;
    max-width: 480px;
  }

  .sc-btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: rgba(0,212,184,0.05);
    border: 1px solid rgba(0,212,184,0.2);
    color: #00D4B8;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    border-radius: 9px;
    text-decoration: none;
    white-space: nowrap;
    transition: all 0.2s;
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: 4px;
  }

  .sc-btn-outline:hover {
    background: rgba(0,212,184,0.1);
    border-color: rgba(0,212,184,0.4);
    transform: translateY(-1px);
  }

  /* ── form section ── */
  .sc-form-card {
    background: rgba(12,13,19,0.8);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 40px;
    backdrop-filter: blur(10px);
    animation: fadeUp 0.5s 0.25s ease both;
    position: relative;
    overflow: hidden;
  }

  .sc-form-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,212,184,0.03) 0%, transparent 60%);
    pointer-events: none;
  }

  .sc-form-group {
    margin-bottom: 24px;
    position: relative;
  }

  .sc-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-bottom: 24px;
  }

  .sc-half { width: 100%; }

  .sc-success-card {
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.22);
    border-radius: 16px;
    padding: 22px 24px;
    margin-bottom: 24px;
    color: #D2F7E4;
  }

  .sc-success-title {
    margin: 0 0 10px;
    font-size: 16px;
    font-weight: 700;
  }

  .sc-success-desc {
    margin: 0;
    line-height: 1.75;
    color: #B8F0D6;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
  }

  .sc-tips-card {
    border-radius: 14px;
    padding: 18px 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 18px;
  }

  .sc-tip-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #00D4B8;
    margin-bottom: 10px;
  }

  .sc-tip-list {
    list-style: none;
    padding-left: 0;
    color: #A0A5B5;
    line-height: 1.8;
    font-size: 13px;
  }

  .sc-tip-list li::before {
    content: "•";
    color: #00D4B8;
    display: inline-block;
    width: 18px;
  }

  .sc-label {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #7A7F8E;
    margin-bottom: 10px;
  }

  .sc-input, .sc-textarea {
    width: 100%;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 16px;
    color: #E8E6E0;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    transition: all 0.2s;
  }

  .sc-textarea {
    min-height: 180px;
    resize: vertical;
    line-height: 1.6;
  }

  .sc-file-input {
    width: 100%;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 12px;
    color: #E8E6E0;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    transition: all 0.2s;
  }

  .sc-file-input:focus {
    outline: none;
    background: rgba(255,255,255,0.04);
    border-color: #00D4B8;
    box-shadow: 0 0 0 3px rgba(0,212,184,0.15);
  }

  .sc-file-list {
    margin-top: 12px;
    display: grid;
    gap: 8px;
  }

  .sc-file-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #A0A5B5;
  }

  .sc-input::placeholder, .sc-textarea::placeholder {
    color: #3A3F4E;
  }

  .sc-input:focus, .sc-textarea:focus {
    outline: none;
    background: rgba(255,255,255,0.04);
    border-color: #00D4B8;
    box-shadow: 0 0 0 3px rgba(0,212,184,0.15);
  }

  /* submit button */
  .sc-btn-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #00D4B8 0%, #00A896 100%);
    color: #07080C;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.02em;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(0,212,184,0.25);
    margin-top: 10px;
  }

  .sc-btn-submit:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,212,184,0.35);
  }

  .sc-btn-submit:disabled {
    background: #2A2F3E;
    color: #5A5F6E;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }

  /* spinner */
  .sc-spinner-btn {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(7,8,12,0.15);
    border-top-color: #07080C;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
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
    .sc-main { padding: 36px 20px 60px; }
    .sc-form-card { padding: 24px; }
    .sc-heading { font-size: 26px; }
  }
`;

/* ─── SVG icons ─────────────────────────────────────────────────────────── */
const IconList = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const IconFile = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);


/* ─── component ─────────────────────────────────────────────────────────── */
function SubmitComplaint() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Network");
  const [priority, setPriority] = useState("Medium");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState([]);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);

  const createComplaint = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Please enter both title and description.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login is required to submit a complaint.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('priority', priority);
      formData.append('location', location);

      files.forEach(file => {
        formData.append('attachments', file);
      });

      const res = await fetch("http://localhost:5000/api/complaint/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to submit complaint.");
      }

      setTitle("");
      setDescription("");
      setCategory("Network");
      setPriority("Medium");
      setLocation("");
      setFiles([]);
      const body = await res.json();
      setSubmittedComplaint(body.complaint);
      toast.success("Complaint submitted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{FONT_LINK}</style>
      <style>{CSS}</style>

      <div className="sc-root">
        <div className="sc-glow-br" />

        <main className="sc-main">
          {/* ── Header ── */}
          <div className="sc-header">
            <div>
              <p className="sc-eyebrow">// new submission</p>
              <h1 className="sc-heading">Submit Complaint</h1>
              <p className="sc-subheading">
                Raise a new issue and our team will begin tracking it right away. Please provide as much detail as possible.
              </p>
            </div>
            <Link to="/track-complaint" className="sc-btn-outline">
              <IconList /> View Tracking
            </Link>
          </div>

          {/* ── Form Card ── */}
          <div className="sc-form-card">
            {submittedComplaint && (
              <div className="sc-success-card">
                <p className="sc-success-title">Complaint filed successfully</p>
                <p className="sc-success-desc">
                  Your complaint ID is <strong>{submittedComplaint._id}</strong>. Track it anytime from the dashboard or with the complaint list below.
                </p>
              </div>
            )}

            <div className="sc-form-group">
              <label className="sc-label">Complaint Title</label>
              <input
                type="text"
                className="sc-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Network connectivity issue in Lab 3"
                disabled={loading}
              />
            </div>

            <div className="sc-row">
              <div className="sc-form-group sc-half">
                <label className="sc-label">Category</label>
                <select
                  className="sc-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                >
                  <option>Network</option>
                  <option>Facility</option>
                  <option>Account</option>
                  <option>Software</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="sc-form-group sc-half">
                <label className="sc-label">Priority</label>
                <select
                  className="sc-input"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={loading}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div className="sc-form-group">
              <label className="sc-label">Location / Department</label>
              <input
                type="text"
                className="sc-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Block C, Computer Lab 2"
                disabled={loading}
              />
            </div>

            <div className="sc-form-group">
              <label className="sc-label">Detailed Description</label>
              <textarea
                className="sc-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail. Include any relevant steps to reproduce, locations, or error messages..."
                disabled={loading}
              />
            </div>

            <div className="sc-form-group">
              <label className="sc-label">Attachments (Optional)</label>
              <input
                type="file"
                multiple
                className="sc-file-input"
                onChange={(e) => setFiles(Array.from(e.target.files))}
                disabled={loading}
                accept="image/*,application/pdf,.doc,.docx,.txt"
              />
              {files.length > 0 && (
                <div className="sc-file-list">
                  {files.map((file, index) => (
                    <div key={index} className="sc-file-item">
                      <IconFile /> {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sc-tips-card">
              <p className="sc-tip-label">Pro tip</p>
              <ul className="sc-tip-list">
                <li>Provide a clear title and exact location.</li>
                <li>Choose the priority level based on urgency.</li>
                <li>Attach screenshots, error logs, or documents for faster resolution.</li>
                <li>Include timestamps or error messages in the description.</li>
              </ul>
            </div>

            <button
              className="sc-btn-submit"
              onClick={createComplaint}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="sc-spinner-btn" />
                  Submitting...
                </>
              ) : (
                <>
                  <IconSend /> Submit Complaint
                </>
              )}
            </button>
            
          </div>
        </main>
      </div>
    </>
  );
}

export default SubmitComplaint;