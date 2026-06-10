import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/wallpaper4.jpg";
import logo from "../assets/logo.png";     
import title from "../assets/font.png";
import { loginUser, resetPassword } from "../services/AuthService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {

      const result = await loginUser(
        email,
        password
      );
  
      if (result.success) {
  
        navigate("/home", {
          replace: true
        });
  
      } else {
  
        alert(result.error);
  
      }
  
    } catch (error) {
  
      console.log(error);
  
    }
  
  };


  const handleForgotPassword =
  async () => {

    if (!email) {

      alert(
        "Please enter your email first."
      );

      return;

    }

    const result =
      await resetPassword(email);

    if (result.success) {

      alert(
        "Password reset email sent."
      );

    } else {

      alert(result.error);

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
      {/* CARD */}
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
          display: "flex",
          boxShadow: "0 0 20px rgba(0,234,255,0.15)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* CONTENT */}
        <div
          style={{
            width: "100%",
            color: "white",
            transform: show ? "translateY(0)" : "translateY(40px)",
            opacity: show ? 1 : 0,
            transition: "all 0.6s ease",
          }}
        >
          {/* LOGO ICON */}
          <div style={{ textAlign: "center", marginBottom: "5px", marginTop:"15px" }}>
            <img src={logo} alt="logo" style={{ width: "40px" }} />
          </div>

          {/* TITLE IMAGE */}
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <img src={title} alt="SafeSense AI" style={{ width: "130px" }} />
          </div>

          {/* EMAIL */}
          <label style={{ fontSize: "12px", opacity: 0.8, display:"block", textAlign:"left", marginLeft:"15px" }}>
            EMAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "90%",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid rgba(255,255,255,0.6)",
              padding: "8px 0",
              marginBottom: "15px",
              color: "white",
              outline: "none",
            }}
          />

          {/* PASSWORD */}
          <label style={{ fontSize: "12px", opacity: 0.8, display:"block", textAlign:"left", marginLeft:"15px" }}>
            PASSWORD
          </label>

          <div style={{ position: "relative" }}>

            <input
              type={showPassword ? "text" : "password"}   
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "90%",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.6)",
                padding: "8px 0",  
                marginBottom: "15px",
                color: "white",
                outline: "none",
              }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "30px",
                top: "8px",
                cursor: "pointer",
                color: "white",
              }}
            >
              {showPassword 
                ? <FaEyeSlash style={{ opacity: 0.6 }} /> 
                : <FaEye style={{ opacity: 0.6 }} />
              }
            </span>
            
          </div>

          {/* FORGOT PASSWORD */}
          <div
          onClick={handleForgotPassword}
            style={{
              textAlign: "right",
              fontSize: "12px",
              marginBottom: "10px",
              marginRight:"15px",
              cursor: "pointer",
              opacity: 0.8,
              color: "#00F3FF"
            }}
          >
            FORGOT PASSWORD?
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            style={{
              width: "90%",
              padding: "12px",
              borderRadius: "5px",
              border: "none",
              color:"black",
              backgroundColor: "#00F3FF",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            LOGIN
          </button>

          {/* REGISTER */}
          <div style={{ textAlign: "center", fontSize: "13px", marginBottom:"15px" }}>
            Don't have an account?{" "}
            <span 
              style={{ color: "#00F3FF", fontWeight: "bold", cursor: "pointer", marginBottom:"15px" }}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}