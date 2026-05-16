import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const FONT_LINK = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
`;

const CSS = (darkMode) => `
  .nav-root {
    position: sticky;
    top: 0;
    z-index: 100;
    background: ${darkMode ? 'rgba(7, 8, 12, 0.75)' : 'rgba(248, 250, 252, 0.9)'};
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    font-family: 'Syne', sans-serif;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    height: 70px;
    padding: 0 40px;
    display: flex;
    justify-content: space-between; /* Pushes Logo left, Links right */
    align-items: center;
  }

  /* CMS Portal Logo (Left Side) */
  .nav-logo {
    font-size: 22px;
    font-weight: 800;
    color: #E8E6E0;
    text-decoration: none;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-logo span {
    color: #00D4B8;
  }

  /* Links Container (Right Side) */
  .nav-links {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .nav-link {
    color: #A0A5B5;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .nav-link:hover {
    color: #00D4B8;
    text-shadow: 0 0 12px rgba(0, 212, 184, 0.4);
  }

  /* Highlighted Links */
  .highlight-link {
    background: rgba(0, 212, 184, 0.08);
    border: 1px solid rgba(0, 212, 184, 0.2);
    color: #00D4B8;
    padding: 8px 18px;
    border-radius: 99px; /* Pill shape */
  }

  .highlight-link:hover {
    background: rgba(0, 212, 184, 0.15);
    border-color: rgba(0, 212, 184, 0.35);
    text-shadow: none;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 212, 184, 0.15);
  }

  /* Icons & Avatars */
  .nav-controls {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-left: 12px;
    padding-left: 16px;
    border-left: 1px solid rgba(255,255,255,0.1);
  }

  .nav-btn-icon {
    background: transparent;
    border: none;
    color: #A0A5B5;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
    padding: 4px;
  }

  .nav-btn-icon:hover {
    color: #00D4B8;
  }

  .nav-badge {
    position: absolute;
    top: -2px;
    right: -4px;
    background: #EF4444;
    color: white;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    padding: 2px 5px;
    border-radius: 10px;
    border: 2px solid #07080C;
  }

  .nav-avatar {
    background: linear-gradient(135deg, #00D4B8 0%, #00A896 100%);
    color: #07080C;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 212, 184, 0.2);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .nav-avatar:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 212, 184, 0.3);
  }

  /* Dropdowns */
  .nav-relative {
    position: relative;
  }

  .nav-dropdown {
    position: absolute;
    top: calc(100% + 14px);
    right: 0;
    background: rgba(12, 13, 19, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    animation: slideDown 0.2s ease forwards;
    transform-origin: top right;
  }

  .nav-dropdown-profile {
    width: 200px;
  }

  .nav-dropdown-notif {
    width: 340px;
    max-height: 400px;
    overflow-y: auto;
    padding: 16px;
  }

  /* Custom Scrollbar for Notifications */
  .nav-dropdown-notif::-webkit-scrollbar {
    width: 4px;
  }
  .nav-dropdown-notif::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
  }

  .nav-dropdown-item {
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    padding: 10px 14px;
    color: #E8E6E0;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 500;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }

  .nav-dropdown-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .nav-dropdown-item.danger {
    color: #EF4444;
  }

  .nav-dropdown-item.danger:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  .nav-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
    margin: 4px 0;
  }

  /* Notifications Content */
  .notif-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .notif-title {
    font-size: 14px;
    font-weight: 700;
    color: #E8E6E0;
  }

  .notif-mark {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: #00D4B8;
    background: rgba(0, 212, 184, 0.1);
    border: 1px solid rgba(0, 212, 184, 0.2);
    border-radius: 6px;
    padding: 5px 10px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .notif-mark:hover {
    background: rgba(0, 212, 184, 0.15);
  }

  .notif-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 14px;
    margin-bottom: 8px;
    transition: background 0.2s;
  }
  
  .notif-card:last-child {
    margin-bottom: 0;
  }

  .notif-card:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .notif-card-title {
    font-size: 13px;
    font-weight: 700;
    color: #E8E6E0;
    margin-bottom: 4px;
  }

  .notif-card-desc {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #A0A5B5;
  }

  .notif-card-time {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: #5A5F6E;
    margin-top: 10px;
  }

  .notif-empty {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #5A5F6E;
    text-align: center;
    padding: 20px 0;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @media (max-width: 768px) {
    .nav-container { padding: 0 20px; }
    .nav-links { gap: 12px; }
    .nav-link.highlight-link { padding: 6px 12px; font-size: 12px; }
  }
`;

/* ─── SVG Icons ─────────────────────────────────────────────────────────── */
const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const IconBox = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00D4B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const IconSun = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const IconMoon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

/* ─── Component ─────────────────────────────────────────────────────────── */
function parseTokenPayload(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function Navbar() {
  const token = localStorage.getItem("token");
  const payload = token ? parseTokenPayload(token) : null;
  const isAuthenticated = Boolean(payload);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const { darkMode } = useContext(ThemeContext);

  let role = null;
  let userName = "";

  if (isAuthenticated) {
    role = payload.role;
    userName = payload.name || "User";
  }

  const getUserInitials = () => {
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const location = useLocation();

  const isAdminPanel = role === "admin" && location.pathname.startsWith("/admin");

  const getLastSeen = (complaintId) => {
    return localStorage.getItem(`complaint_last_seen_${complaintId}`);
  };

  const setLastSeen = (complaintId, updatedAt) => {
    localStorage.setItem(`complaint_last_seen_${complaintId}`, updatedAt);
  };

  useEffect(() => {
    if (!token || role !== "user") {
      setUnreadCount(0);
      return;
    }

    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const res = await fetch("http://localhost:5000/api/complaint/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!Array.isArray(data)) return;

        const unread = data.filter((complaint) => {
          const lastSeen = getLastSeen(complaint._id);
          return (
            complaint.status !== "Pending" &&
            (!lastSeen || new Date(complaint.updatedAt) > new Date(lastSeen))
          );
        });

        setUnreadCount(unread.length);
        setNotifications(unread);
      } catch (error) {
        console.error("Failed to load complaint notifications", error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, [token, role]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const markNotificationsRead = () => {
    if (!token) return;

    fetch("http://localhost:5000/api/complaint/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        data.forEach((complaint) => {
          if (complaint.status !== "Pending") {
            setLastSeen(complaint._id, complaint.updatedAt);
          }
        });
        setUnreadCount(0);
        setNotifications([]);
        setIsDropdownOpen(false);
      })
      .catch((error) => {
        console.error("Failed to mark notifications read", error);
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminLogin");
    localStorage.removeItem("userLogin");
    window.location.href = "/";
  };

  const handleEditProfile = () => {
    setIsProfileMenuOpen(false);
    navigate("/profile");
  };

  return (
    <>
      <style>{FONT_LINK}</style>
      <style>{CSS(darkMode)}</style>

      <nav className="nav-root">
        <div className="nav-container">
          {/* LOGO (Always on the Left) */}
          <Link to="/" className="nav-logo">
            <IconBox /> CMS<span>Portal</span>
          </Link>

          {/* RIGHT SIDE CONTAINER */}
          <div className="nav-links">
            
            {/* Highlighted Navigation Links */}
            {!isAdminPanel && (
              <Link to="/" className="nav-link highlight-link">
                Home
              </Link>
            )}

            {role === "user" && (
              <>
                <Link to="/submit-complaint" className="nav-link highlight-link">
                  Submit
                </Link>
                <Link to="/track-complaint" className="nav-link highlight-link">
                  Track
                </Link>
              </>
            )}

            {!isAdminPanel && role === "admin" && (
              <Link to="/admin" className="nav-link highlight-link">
                Admin Panel
              </Link>
            )}

            {isAdminPanel && (
              <button
                type="button"
                className="nav-link highlight-link"
                onClick={logout}
                style={{
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  background: "rgba(239, 68, 68, 0.12)",
                  color: "#FECACA",
                  cursor: "pointer"
                }}
              >
                Secure Logout
              </button>
            )}

            {!isAuthenticated && (
              <>
                <Link to="/login" className="nav-link" style={{ color: "#00D4B8" }}>
                  Login
                </Link>
                <Link to="/register" className="nav-link" style={{ color: "#00D4B8" }}>
                  Register
                </Link>
              </>
            )}

            {/* Profile & Notifications grouped with a vertical divider */}
            {(token && role === "user") && (
              <div className="nav-controls">
                
                {/* NOTIFICATIONS */}
                <div className="nav-relative">
                  <button className="nav-btn-icon" onClick={toggleDropdown}>
                    <IconBell />
                    {unreadCount > 0 && (
                      <span className="nav-badge">{unreadCount}</span>
                    )}
                  </button>

                  {isDropdownOpen && (
                    <div className="nav-dropdown nav-dropdown-notif">
                      <div className="notif-header">
                        <span className="notif-title">Notifications</span>
                        {notifications.length > 0 && (
                          <button className="notif-mark" onClick={markNotificationsRead}>
                            Mark all read
                          </button>
                        )}
                      </div>

                      {loadingNotifications ? (
                        <div className="notif-empty">Loading...</div>
                      ) : notifications.length === 0 ? (
                        <div className="notif-empty">No new notifications.</div>
                      ) : (
                        notifications.map((complaint) => (
                          <div key={complaint._id} className="notif-card">
                            <div className="notif-card-title">{complaint.title}</div>
                            <div className="notif-card-desc">
                              Status changed to <strong style={{ color: "#E8E6E0" }}>{complaint.status}</strong>
                            </div>
                            <div className="notif-card-time">
                              {new Date(complaint.updatedAt).toLocaleString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* PROFILE MENU */}
                <div className="nav-relative">
                  <button className="nav-avatar" onClick={toggleProfileMenu}>
                    {getUserInitials()}
                  </button>

                  {isProfileMenuOpen && (
                    <div className="nav-dropdown nav-dropdown-profile">
                      <button className="nav-dropdown-item" onClick={handleEditProfile}>
                        Edit Profile
                      </button>
                      <div className="nav-divider" />
                      <button className="nav-dropdown-item danger" onClick={logout}>
                        Logout
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;