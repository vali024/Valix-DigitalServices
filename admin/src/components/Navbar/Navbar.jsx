import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Zap, MessageSquare, Package, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on mount and changes
    const auth = localStorage.getItem("adminAuth");
    if (!auth) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    try {
      // Clear all auth-related data
      localStorage.clear();
      sessionStorage.clear();

      // Show success message
      toast.success("Logged out successfully");

      // Force navigation to login
      setTimeout(() => {
        navigate("/login", { replace: true });
        window.location.reload(); // Force reload to clear any cached states
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout. Please try again.");
    }
  };

  const auth = JSON.parse(localStorage.getItem("adminAuth"));

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="logo-icon">
          <Zap className="logo-zap" size={24} />
        </div>
        <div className="logo-text">
          <span className="logo-main">VALIX</span>
          <span className="logo-sub">DIGITAL SERVICES</span>
        </div>
      </div>
      <div className="nav-right">
        {auth?.email && (
          <div className="admin-profile">
            <span className="admin-email">{auth.email}</span>
          </div>
        )}
        <button onClick={handleLogout} className="logout-btn" type="button">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
