import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../api/client";
import { useNavigate, Link } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      login(res.data.data);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Đăng nhập thất bại");
    }
  };

  const handleDemoLogin = (type: "mentee" | "mentor") => {
    if (type === "mentee") {
      setEmail("mentee.demo@careerconnect.dev");
      setPassword("password123");
    } else {
      setEmail("an.nguyen@vng.com");
      setPassword("password123");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
      <h2>Đăng nhập</h2>
      
      {/* Demo helper */}
      <div style={{ marginBottom: 20, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 4, fontSize: 14 }}>
        <p style={{ margin: "0 0 10px 0" }}><strong>Dành cho Ban giám khảo (Demo):</strong></p>
        <button type="button" onClick={() => handleDemoLogin("mentee")} style={{ marginRight: 10, cursor: "pointer" }}>Điền tài khoản Mentee</button>
        <button type="button" onClick={() => handleDemoLogin("mentor")} style={{ cursor: "pointer" }}>Điền tài khoản Mentor</button>
      </div>

      {error && <div style={{ color: "red", marginBottom: 15 }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            style={{ width: "100%", padding: 8, marginTop: 5 }}
          />
        </div>
        <div>
          <label>Mật khẩu</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ width: "100%", padding: 8, marginTop: 5 }}
          />
        </div>
        <button type="submit" style={{ padding: 10, backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
          Đăng nhập
        </button>
      </form>
      <p style={{ marginTop: 20, textAlign: "center" }}>
        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </p>
    </div>
  );
};
