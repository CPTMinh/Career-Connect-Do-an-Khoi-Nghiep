import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Navbar: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "15px 30px", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: 20 }}>
      <div>
        <Link to="/" style={{ textDecoration: "none", color: "#0070f3", fontSize: "1.2rem", fontWeight: "bold" }}>
          Career Connect
        </Link>
      </div>
      <div>
        {!loading && (
          <>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                <span style={{ fontWeight: 500 }}>
                  Xin chào, {user.fullName} ({user.role})
                </span>
                <button 
                  onClick={handleLogout}
                  style={{ padding: "5px 10px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <Link to="/login" style={{ textDecoration: "none", padding: "5px 10px", backgroundColor: "#f0f0f0", color: "#333", borderRadius: 4 }}>
                  Đăng nhập
                </Link>
                <Link to="/register" style={{ textDecoration: "none", padding: "5px 10px", backgroundColor: "#0070f3", color: "white", borderRadius: 4 }}>
                  Đăng ký
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};
