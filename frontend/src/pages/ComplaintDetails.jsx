import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ThemeContext } from "../context/ThemeContext";

const FONT_LINK = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cd-root {
    min-height: calc(100vh - 62px);
    background: #07080C;
    font-family: 'Syne', sans-serif;
    color: #E8E6E0;
    position: relative;
    overflow: hidden;
  }

  .cd-root::before {
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

  .cd-main {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 56px 48px 80px;
  }

  .cd-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .cd-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #00D4B8;
    text-decoration: none;
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    transition: color 0.2s;
  }

  .cd-back:hover {
    color: #00A896;
  }

  .cd-title {
    font-size: 32px;
    font-weight: 800;
    color: #F0EEE8;
    letter-spacing: -0.025em;
  }

  .cd-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 32px;
  }

  .cd-meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #5A5F6E;
  }

  .cd-status {
    padding: 6px 12px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .status-pending { background: rgba(255,180,50,0.12); color: #FFB432; }
  .status-progress { background: rgba(0,212,184,0.12); color: #00D4B8; }
  .status-resolved { background: rgba(80,200,120,0.12); color: #50C878; }

  .cd-section {
    background: rgba(12,13,19,0.8);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
  }

  .cd-section-title {
    font-size: 18px;
    font-weight: 700;
    color: #F0EEE8;
    margin-bottom: 16px;
  }

  .cd-description {
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    color: #A0A5B5;
    line-height: 1.6;
    white-space: pre-wrap;
  }

  .cd-attachments {
    display: grid;
    gap: 12px;
  }

  .cd-attachment {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 8px;
  }

  .cd-attachment-icon {
    width: 32px;
    height: 32px;
    background: rgba(0,212,184,0.1);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cd-attachment-info {
    flex: 1;
  }

  .cd-attachment-name {
    font-size: 14px;
    color: #E8E6E0;
    margin-bottom: 2px;
  }

  .cd-attachment-size {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #5A5F6E;
  }

  .cd-attachment-link {
    color: #00D4B8;
    text-decoration: none;
    font-size: 12px;
  }

  .cd-comments {
    display: grid;
    gap: 16px;
  }

  .cd-comment {
    padding: 16px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
  }

  .cd-comment-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .cd-comment-author {
    font-size: 13px;
    font-weight: 600;
    color: #E8E6E0;
  }

  .cd-comment-time {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: #5A5F6E;
  }

  .cd-comment-text {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: #A0A5B5;
    line-height: 1.5;
  }

  .cd-comment-form {
    display: grid;
    gap: 12px;
  }

  .cd-comment-input {
    width: 100%;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 12px;
    color: #E8E6E0;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    min-height: 80px;
    resize: vertical;
  }

  .cd-comment-input::placeholder {
    color: #5A5F6E;
  }

  .cd-comment-btn {
    align-self: flex-start;
    padding: 10px 20px;
    background: linear-gradient(135deg, #00D4B8 0%, #00A896 100%);
    color: #07080C;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .cd-comment-btn:hover {
    opacity: 0.9;
  }

  .cd-feedback {
    padding: 20px;
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 12px;
  }

  .cd-feedback-title {
    font-size: 16px;
    font-weight: 700;
    color: #D2F7E4;
    margin-bottom: 12px;
  }

  .cd-feedback-rating {
    display: flex;
    gap: 4px;
    margin-bottom: 12px;
  }

  .cd-star {
    width: 24px;
    height: 24px;
    fill: #50C878;
    cursor: pointer;
  }

  .cd-feedback-text {
    width: 100%;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 12px;
    color: #E8E6E0;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    min-height: 60px;
    resize: vertical;
  }

  .cd-feedback-btn {
    margin-top: 12px;
    padding: 10px 20px;
    background: #50C878;
    color: #07080C;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  @media (max-width: 640px) {
    .cd-main { padding: 36px 20px 60px; }
    .cd-title { font-size: 24px; }
    .cd-meta { flex-direction: column; align-items: flex-start; }
  }
`;

function ComplaintDetails() {
  const { id } = useParams();
  const { darkMode } = useContext(ThemeContext);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchComplaint = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/complaint/details/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setComplaint(data);
      } else {
        toast.error("Failed to load complaint details");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading complaint");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const addComment = async () => {
    if (!commentText.trim()) return;

    const token = localStorage.getItem("token");
    setSubmittingComment(true);
    try {
      const res = await fetch(`http://localhost:5000/api/complaint/comment/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText.trim() }),
      });
      if (res.ok) {
        setCommentText('');
        toast.success("Comment added");
        fetchComplaint();
      } else {
        toast.error("Failed to add comment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const submitFeedback = async () => {
    if (feedbackRating < 1 || feedbackRating > 5) {
      toast.error("Please select a rating");
      return;
    }

    const token = localStorage.getItem("token");
    setSubmittingFeedback(true);
    try {
      const res = await fetch(`http://localhost:5000/api/complaint/feedback/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: feedbackRating, comment: feedbackComment.trim() }),
      });
      if (res.ok) {
        toast.success("Feedback submitted");
        fetchComplaint();
      } else {
        toast.error("Failed to submit feedback");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="cd-root">
        <div className="cd-main" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,212,184,0.2)', borderTopColor: '#00D4B8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
          <p style={{ color: '#5A5F6E' }}>Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="cd-root">
        <div className="cd-main" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <p style={{ color: '#5A5F6E' }}>Complaint not found.</p>
          <Link to="/track-complaint" style={{ color: '#00D4B8', textDecoration: 'none' }}>Back to complaints</Link>
        </div>
      </div>
    );
  }

  const statusClass = complaint.status?.toLowerCase().replace(' ', '') || 'pending';

  return (
    <>
      <style>{FONT_LINK}</style>
      <style>{CSS}</style>

      <div className="cd-root">
        <div className="cd-main">
          <div className="cd-header">
            <Link to="/track-complaint" className="cd-back">
              <IconArrow /> Back to complaints
            </Link>
            <h1 className="cd-title">{complaint.title}</h1>
          </div>

          <div className="cd-meta">
            <span className="cd-meta-item">
              <IconCal /> Created {new Date(complaint.createdAt).toLocaleDateString()}
            </span>
            <span className="cd-meta-item">
              <IconDept /> {complaint.category}
            </span>
            <span className="cd-meta-item">
              <IconDept /> Priority: {complaint.priority}
            </span>
            <span className={`cd-status status-${statusClass}`}>
              {complaint.status || 'Pending'}
            </span>
          </div>

          <div className="cd-section">
            <h2 className="cd-section-title">Description</h2>
            <p className="cd-description">{complaint.description}</p>
          </div>

          {complaint.attachments && complaint.attachments.length > 0 && (
            <div className="cd-section">
              <h2 className="cd-section-title">Attachments</h2>
              <div className="cd-attachments">
                {complaint.attachments.map((att, index) => (
                  <div key={index} className="cd-attachment">
                    <div className="cd-attachment-icon">
                      <IconFile />
                    </div>
                    <div className="cd-attachment-info">
                      <div className="cd-attachment-name">{att.originalName}</div>
                      <div className="cd-attachment-size">{formatFileSize(att.size)}</div>
                    </div>
                    <a
                      href={`http://localhost:5000/uploads/${att.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cd-attachment-link"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="cd-section">
            <h2 className="cd-section-title">Comments & Updates</h2>
            {complaint.comments && complaint.comments.length > 0 ? (
              <div className="cd-comments">
                {complaint.comments.map((comment, index) => (
                  <div key={index} className="cd-comment">
                    <div className="cd-comment-header">
                      <span className="cd-comment-author">{comment.user.name}</span>
                      <span className="cd-comment-time">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="cd-comment-text">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#5A5F6E', fontStyle: 'italic' }}>No comments yet.</p>
            )}

            <div className="cd-comment-form">
              <textarea
                className="cd-comment-input"
                placeholder="Add a comment or update..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={submittingComment}
              />
              <button
                className="cd-comment-btn"
                onClick={addComment}
                disabled={submittingComment || !commentText.trim()}
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>

          {complaint.status === 'Resolved' && !complaint.feedback && (
            <div className="cd-section">
              <h2 className="cd-section-title">Submit Feedback</h2>
              <div className="cd-feedback">
                <p className="cd-feedback-title">How was your experience?</p>
                <div className="cd-feedback-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconStar
                      key={star}
                      className="cd-star"
                      style={{ fill: star <= feedbackRating ? '#50C878' : 'rgba(255,255,255,0.2)' }}
                      onClick={() => setFeedbackRating(star)}
                    />
                  ))}
                </div>
                <textarea
                  className="cd-feedback-text"
                  placeholder="Optional feedback comment..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                />
                <button
                  className="cd-feedback-btn"
                  onClick={submitFeedback}
                  disabled={submittingFeedback || feedbackRating < 1}
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </div>
          )}

          {complaint.feedback && (
            <div className="cd-section">
              <h2 className="cd-section-title">Your Feedback</h2>
              <div className="cd-feedback">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconStar
                      key={star}
                      style={{ fill: star <= complaint.feedback.rating ? '#50C878' : 'rgba(255,255,255,0.2)', width: '20px', height: '20px' }}
                    />
                  ))}
                  <span style={{ color: '#D2F7E4', fontSize: '14px' }}>{complaint.feedback.rating}/5</span>
                </div>
                {complaint.feedback.comment && (
                  <p style={{ color: '#B8F0D6', fontSize: '14px', margin: 0 }}>{complaint.feedback.comment}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const IconCal = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconDept = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M9 3v18M3 9h18M3 15h18"/>
  </svg>
);

const IconFile = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const IconStar = ({ className, style, onClick }) => (
  <svg className={className} style={style} onClick={onClick} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export default ComplaintDetails;