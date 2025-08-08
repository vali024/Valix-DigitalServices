import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Zap } from 'lucide-react';
import "./Login.css";

const validCredentials = [
  { email: "chanvifarms9@gmail.com", password: "Chanvifarms99" },
  { email: "lovelyboyarun91@gmail.com", password: "vali@18024" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const isValidUser = validCredentials.some(
      (cred) => cred.email === email && cred.password === password
    );

    if (isValidUser) {
      // Store auth state
      localStorage.setItem(
        "adminAuth",
        JSON.stringify({ email, isAuthenticated: true })
      );
      toast.success("Login successful!");
      navigate("/list");
    } else {
      toast.error("Invalid credentials!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <div className="logo-icon">
            <Zap size={28} className="logo-zap" />
          </div>
          <div className="logo-text">
            <span className="logo-main">VALIX</span>
            <span className="logo-sub">DIGITAL SERVICES</span>
          </div>
        </div>
        <h2>Admin Dashboard</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            <span>Sign In</span>
            <Zap size={18} className="button-icon" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
