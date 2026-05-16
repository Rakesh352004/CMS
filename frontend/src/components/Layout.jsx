import { Link, useLocation } from "react-router-dom";

function Layout({ children }) {
  const location = useLocation();

  const linkStyle = (path) => ({
    display: "block",
    padding: "12px",
    color: location.pathname === path ? "#4CAF50" : "white",
    textDecoration: "none",
    borderRadius: "6px",
    marginBottom: "5px"
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "220px",
        background: "#1e293b",
        color: "white",
        padding: "20px"
      }}>
        <h2>CMS</h2>

        <Link to="/home" style={linkStyle("/home")}>Home</Link>
        <Link to="/submit-complaint" style={linkStyle("/submit-complaint")}>Submit Complaint</Link>
        <Link to="/track-complaint" style={linkStyle("/track-complaint")}>Track Complaint</Link>
        <Link to="/profile" style={linkStyle("/profile")}>Profile</Link>
        <Link to="/admin" style={linkStyle("/admin")}>Admin</Link>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, background: "#f1f5f9" }}>

        {/* HEADER */}
        <div style={{
          background: "white",
          padding: "15px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}>
          <h3>Complaint Management System</h3>
        </div>

        {/* PAGE CONTENT */}
        <div style={{ padding: "20px" }}>
          {children}
        </div>

      </div>
    </div>
  );
}

export default Layout;