import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SubmitComplaint from "./pages/SubmitComplaint.jsx";
import TrackComplaint from "./pages/TrackComplaint.jsx";
import Admin from "./pages/Admin.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import ComplaintDetails from "./pages/ComplaintDetails.jsx";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeProvider, { ThemeContext } from "./context/ThemeContext";
import { useContext, useEffect } from "react";

function Footer() {
  const { darkMode } = useContext(ThemeContext);
  return (
    <footer style={{
      background: darkMode ? "#010306" : "#f8fafc",
      color: darkMode ? "#C0C4CE" : "#334155",
      padding: "42px 24px",
      borderTop: darkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
      fontFamily: "'Syne', sans-serif",
      width: "100%"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: "24px", gridTemplateColumns: "1.5fr 1fr 1fr", alignItems: "start" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: darkMode ? "#FFFFFF" : "#0f172a" }}>CMS Portal</h3>
          <p style={{ margin: "12px 0 0", lineHeight: 1.8, maxWidth: 420, color: darkMode ? "#A0A5B5" : "#475569" }}>
            A secure complaint management landing page built to let citizens file issues, track progress, and stay informed from first report to final resolution.
          </p>
        </div>

        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: darkMode ? "#00D4B8" : "#0f766e" }}>Quick Links</p>
          <nav style={{ display: "grid", gap: "10px", marginTop: 16 }}>
            <a href="/" style={{ color: darkMode ? "#E8E6E0" : "#334155", textDecoration: "none" }}>Home</a>
            <a href="/login" style={{ color: darkMode ? "#E8E6E0" : "#334155", textDecoration: "none" }}>Login</a>
            <a href="/register" style={{ color: darkMode ? "#E8E6E0" : "#334155", textDecoration: "none" }}>Register</a>
            <a href="/track-complaint" style={{ color: darkMode ? "#E8E6E0" : "#334155", textDecoration: "none" }}>Track Complaint</a>
          </nav>
        </div>

        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: darkMode ? "#00D4B8" : "#0f766e" }}>Support</p>
          <p style={{ margin: "14px 0 0", color: darkMode ? "#A0A5B5" : "#475569", lineHeight: 1.8 }}>
            Need help? Reach out to support@cmsportal.example.com for fast assistance, or use the submit and track pages after login.
          </p>
        </div>
      </div>
      <div style={{ marginTop: 32, textAlign: "center", fontSize: 13, color: darkMode ? "#6b7280" : "#64748b" }}>
        © 2026 CMS Portal. Built for fast, reliable community complaint management.
      </div>
    </footer>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MainApp />
        {/* Updated ToastContainer to match the Dark Glass UI */}
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          theme="dark"
          toastStyle={{
            background: "rgba(12, 13, 19, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            color: "#E8E6E0",
            fontFamily: "'Syne', sans-serif",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function MainApp() {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  return (
    <>
      <AppRoutes />
      {!isAdminPage && <Footer />}
    </>
  );
}

function parseTokenPayload(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function AppRoutes() {
  const token = localStorage.getItem("token");
  const payload = token ? parseTokenPayload(token) : null;
  const validToken = payload ? token : null;
  const isAdmin = payload?.role === "admin";
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    if (token && !payload) {
      localStorage.removeItem("token");
    }
  }, [token, payload]);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/complaint/:id"
          element={validToken ? <ComplaintDetails /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={token ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />) : <Login />}
        />
        <Route
          path="/register"
          element={
            token ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />) : <Register />
          }
        />
        <Route
          path="/submit-complaint"
          element={token ? <SubmitComplaint /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/submit"
          element={token ? <SubmitComplaint /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/track-complaint"
          element={token ? <TrackComplaint /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/track"
          element={token ? <TrackComplaint /> : <Navigate to="/login" replace />}
        />
        
        <Route 
          path="/profile" 
          element={token ? <Profile /> : <Navigate to="/login" replace />} 
        />
        
        <Route 
          path="/admin" 
          element={token && isAdmin ? <Admin /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </>
  );
}

export default App;