import bg from "../assets/wallpaper4.jpg";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { registerUser } from "../services/AuthService";

export default function RegisterUser() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setShow(true);
  }, []);

  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      if (!value.includes("@") || !value.includes(".com")) {
        error = "Invalid";
      }
    }

    if (name === "username") {
      if (!value || value.length > 10) {
        error = "Max 10";
      }
    }

    if (name === "contact") {
      if (!/^[0-9]{9,10}$/.test(value)) {
        error = "Invalid";
      }
    }

    if (name === "password") {
      if (value.length < 6) {
        error = "Min 6";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };


  const isFieldValid = (name, value) => {
    if (name === "email") return value.includes("@") && value.includes(".com");
    if (name === "username") return value && value.length <= 10;
    if (name === "contact") return /^[0-9]{9,10}$/.test(value);
    if (name === "password") return value.length >= 6;
  };

  const isFormValid =
  isFieldValid("email", email) &&
  isFieldValid("username", username) &&
  isFieldValid("contact", contact) &&
  isFieldValid("password", password);

  const handleRegister = async () => {
    try {
      await registerUser(email, password, username, contact);
  
      alert("Registered successfully!");
      navigate("/");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0,10,20,0.1), rgba(0,10,20,0.2)),url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "70%",
          maxWidth: "280px",
          maxHeight: "65vh",
          padding: "40px",
          marginLeft: "5%",
          borderRadius: "5px",
          background: "rgba(10, 30, 50, 0.55)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0,234,255,0.4)",
          boxShadow: "0 0 20px rgba(0,234,255,0.15)",
        }}
      >
        <div
          style={{
            color: "white",
            transform: show ? "translateY(0)" : "translateY(10px)",
            opacity: show ? 1 : 0,
            transition: "all 0.6s ease",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "8px"}}>
            CREATE ACCOUNT
          </h2>

          {/* EMAIL */}
          <label style={labelStyle}>Email*</label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateField("email", email)}
              style={inputStyle(errors.email)}
            />
            {errors.email && (
              <span style={overlayErrorStyle}>{errors.email}</span>
            )}
            {!errors.email && email && isFieldValid("email", email) && (
              <FaCheckCircle
                style={{
                  position: "absolute",
                  right: "0",
                  top: "8px",
                  color: "#22c55e",
                  fontSize: "14px",
                }}
              />
            )}
          </div>

          {/* USERNAME + CONTACT */}
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Username*</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => validateField("username", username)}
                  style={inputStyle(errors.username)}
                />
                {errors.username && (
                  <span style={overlayErrorStyle}>{errors.username}</span>
                )}
                {!errors.username && username && isFieldValid("username", username) && (
                  <FaCheckCircle
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "8px",
                      color: "#22c55e",
                      fontSize: "14px",
                    }}
                  />
                )}
                </div>
            </div>

            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Contact*</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <div style={{ marginRight: "10px", opacity: 0.8 }}>+60</div>

                <input
                  type="text"
                  value={contact}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.startsWith("0")) value = value.substring(1);
                    setContact(value);
                  }}
                  onBlur={() => validateField("contact", contact)}
                  style={inputStyle(errors.contact)}
                />

                {errors.contact && (
                  <span style={overlayErrorStyle}>
                    {errors.contact}
                  </span>
                )}
                {!errors.contact && contact && isFieldValid("contact", contact) && (
                  <FaCheckCircle
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "8px",
                      color: "#22c55e",
                      fontSize: "14px",
                    }}
                  />
                )}
              </div>
            </div>
          </div>

            {/* PASSWORD */}
            <label style={labelStyle}>Password*</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validateField("password", password)}
                style={inputStyle(errors.password)}
              />

              {/* 👁 toggle */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "35px",
                  top: "8px",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                {showPassword ? <FaEyeSlash style={{ opacity: 0.6 }} /> : <FaEye style={{ opacity: 0.6 }} />}
              </span>
            
              {errors.password && (
                <span style={overlayErrorStyle}>{errors.password}</span>
              )}

              {!errors.password && password && isFieldValid("password", password) && (
                <FaCheckCircle
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "8px",
                    color: "#22c55e",
                  }}
                />
              )}
            </div>

          {/* BUTTON */}
          <button
              onClick={handleRegister}
              disabled={!isFormValid}
              style={{
                ...buttonStyle,
                opacity: isFormValid ? 1 : 0.5,
                cursor: isFormValid ? "pointer" : "not-allowed",
              }}
            >
              REGISTER
          </button>

          {/* BACK */}
          <div
            onClick={() => navigate("/")}
            style={{
              textAlign: "center",
              marginTop: "5px",
              cursor: "pointer",
              fontSize: "13px",
              opacity: 0.8,
            }}
          >
            Back to Login
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const labelStyle = {
  fontSize: "13px",
  opacity: 0.8,
  display: "block",
  textAlign: "left",
  marginBottom: "2px"
};

const inputStyle = (error) => ({
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: error
    ? "1px solid #ff4d4f"
    : "1px solid rgba(255,255,255,0.6)",
  padding: "8px 0",
  marginBottom: "15px",
  color: "white",
  outline: "none",
  fontSize: "14px",
});

const overlayErrorStyle = {
  position: "absolute",
  right: "0",
  top: "8px",
  fontSize: "11px",
  color: "#ff4d4f",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "5px",
  border: "none",
  marginTop: "15px",
  fontWeight: "bold",
  cursor: "pointer",
  background: "white",
  color: "black",
  backgroundColor: "#00F3FF"
};