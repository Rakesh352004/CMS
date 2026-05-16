import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FONT_LINK = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pf-root {
    min-height: calc(100vh - 70px);
    background: #07080C;
    font-family: 'Syne', sans-serif;
    color: #E8E6E0;
    position: relative;
    overflow: hidden;
  }

  .pf-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,212,184,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,184,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .pf-glow-tr {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,184,0.06) 0%, transparent 70%);
    top: -200px;
    right: -200px;
    pointer-events: none;
    z-index: 0;
  }

  .pf-main {
    position: relative;
    z-index: 1;
    max-width: 640px;
    margin: 0 auto;
    padding: 56px 24px 80px;
  }

  /* ── Header ── */
  .pf-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 40px;
    animation: fadeUp 0.5s 0.1s ease both;
    gap: 16px;
    flex-wrap: wrap;
  }

  .pf-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #00D4B8;
    margin-bottom: 10px;
  }

  .pf-heading {
    font-size: 34px;
    font-weight: 800;
    line-height: 1.12;
    color: #F0EEE8;
    letter-spacing: -0.02em;
  }

  .pf-btn-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.1);
    color: #E8E6E0;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .pf-btn-toggle:hover {
    background: rgba(255,255,255,0.08);
  }
  
  .pf-btn-toggle.active {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
    color: #EF4444;
  }

  /* ── Card ── */
  .pf-card {
    background: rgba(12,13,19,0.8);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 40px;
    backdrop-filter: blur(12px);
    animation: fadeUp 0.5s 0.2s ease both;
    position: relative;
    overflow: hidden;
  }

  .pf-group {
    margin-bottom: 24px;
  }

  .pf-label {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #7A7F8E;
    margin-bottom: 10px;
  }

  .pf-value {
    font-size: 16px;
    font-weight: 500;
    color: #E8E6E0;
    padding: 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .pf-input {
    width: 100%;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 14px 16px;
    color: #E8E6E0;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    transition: all 0.2s;
  }

  .pf-input:focus {
    outline: none;
    border-color: #00D4B8;
    background: rgba(255,255,255,0.04);
    box-shadow: 0 0 0 3px rgba(0,212,184,0.15);
  }

  .pf-divider {
    height: 1px;
    background: rgba(255,255,255,0.08);
    margin: 32px 0;
  }

  .pf-subtitle {
    font-size: 16px;
    font-weight: 700;
    color: #E8E6E0;
    margin-bottom: 20px;
  }

  .pf-btn-save {
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
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(0,212,184,0.25);
    margin-top: 10px;
  }

  .pf-btn-save:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,212,184,0.35);
  }

  .pf-btn-save:disabled {
    background: #2A2F3E;
    color: #5A5F6E;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }

  /* ── Loader ── */
  .pf-loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 70px);
    background: #07080C;
    color: #7A7F8E;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    gap: 16px;
  }

  .pf-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(0,212,184,0.15);
    border-top-color: #00D4B8;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }
  
  .pf-spinner-small {
    width: 18px;
    height: 18px;
    border-width: 2px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 640px) {
    .pf-card { padding: 24px; }
  }
`;

/* ─── SVG Icons ─────────────────────────────────────────────────────────── */
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconSave = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

/* ─── Component ─────────────────────────────────────────────────────────── */
function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePhone = (phone) => {
    // Basic phone validation (optional + symbol, digits, spaces, dashes)
    if (!phone) return true; // allow empty phone if not required
    return /^\+?[0-9\s\-()]{7,15}$/.test(phone);
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (!formData.email.endsWith('@gmail.com')) {
      toast.error("Please use a valid Gmail address (e.g., yourname@gmail.com).");
      return;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      if (passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          toast.error("Passwords do not match");
          setSaving(false);
          return;
        }
        updateData.password = passwordData.newPassword;
      }

      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setPasswordData({ newPassword: "", confirmPassword: "" });
      setIsEditing(false);
      toast.success("Profile updated successfully");
      
      // Force a tiny reload or event to let Navbar know the name changed (optional)
      window.dispatchEvent(new Event("storage"));

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{FONT_LINK}</style>
        <style>{CSS}</style>
        <div className="pf-loader-container">
          <div className="pf-spinner" />
          <p>Accessing Secure Profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{FONT_LINK}</style>
      <style>{CSS}</style>

      <div className="pf-root">
        <div className="pf-glow-tr" />

        <main className="pf-main">
          
          {/* ── Header ── */}
          <div className="pf-header">
            <div>
              <p className="pf-eyebrow">// Identity Settings</p>
              <h1 className="pf-heading">User Profile</h1>
            </div>
            
            <button
              className={`pf-btn-toggle ${isEditing ? 'active' : ''}`}
              onClick={() => {
                setIsEditing(!isEditing);
                setPasswordData({ newPassword: "", confirmPassword: "" }); // Reset passwords on cancel
              }}
            >
              {isEditing ? <><IconX /> Cancel Edit</> : <><IconEdit /> Edit Profile</>}
            </button>
          </div>

          {/* ── Card ── */}
          <div className="pf-card">
            
            <div className="pf-group">
              <label className="pf-label">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  className="pf-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  disabled={saving}
                />
              ) : (
                <div className="pf-value">{formData.name || "—"}</div>
              )}
            </div>

            <div className="pf-group">
              <label className="pf-label">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  className="pf-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled={saving}
                />
              ) : (
                <div className="pf-value">{formData.email || "—"}</div>
              )}
            </div>

            <div className="pf-group">
              <label className="pf-label">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  className="pf-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +1 (555) 123-4567"
                  disabled={saving}
                />
              ) : (
                <div className="pf-value">{formData.phone || "—"}</div>
              )}
            </div>

            {/* Password Section */}
            {isEditing && (
              <>
                <div className="pf-divider" />
                <h3 className="pf-subtitle">Security Updates</h3>
                
                <div className="pf-group">
                  <label className="pf-label">New Password (Optional)</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="pf-input"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Leave blank to keep current password"
                    disabled={saving}
                  />
                </div>

                {passwordData.newPassword && (
                  <div className="pf-group">
                    <label className="pf-label">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="pf-input"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Type new password again"
                      disabled={saving}
                    />
                  </div>
                )}

                <button
                  className="pf-btn-save"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="pf-spinner pf-spinner-small" /> Saving...
                    </>
                  ) : (
                    <>
                      <IconSave /> Save Changes
                    </>
                  )}
                </button>
              </>
            )}
            
          </div>
        </main>
      </div>
    </>
  );
}

export default Profile;