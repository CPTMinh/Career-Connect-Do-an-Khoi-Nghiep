import React, { useState } from "react";
import { apiClient } from "../api/client";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("MENTEE");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await apiClient.post("/auth/register", { email, password, fullName, role });
      // Tự động đăng nhập sau khi đăng ký
      login(res.data.data);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Đăng ký thất bại");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
      <h2>Đăng ký tài khoản</h2>
      {error && <div style={{ color: "red", marginBottom: 15 }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div>
          <label>Họ và tên</label>
          <input 
            type="text" 
            value={fullName} 
            onChange={e => setFullName(e.target.value)} 
            required 
            style={{ width: "100%", padding: 8, marginTop: 5 }}
          />
        </div>
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
        <div>
          <label>Bạn là ai?</label>
          <select 
            value={role} 
            onChange={e => setRole(e.target.value)} 
            style={{ width: "100%", padding: 8, marginTop: 5 }}
          >
            <option value="MENTEE">Mentee (Người học)</option>
            <option value="MENTOR">Mentor (Người hướng dẫn)</option>
          </select>
        </div>
        <button type="submit" style={{ padding: 10, backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
          Đăng ký
        </button>
      </form>
      <p style={{ marginTop: 20, textAlign: "center" }}>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
};
