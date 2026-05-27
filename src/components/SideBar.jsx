import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaHome, 
  FaChartBar, 
  FaVideo, 
  FaFileAlt, 
  FaCog,
  FaSignOutAlt 
} from "react-icons/fa";
import {
  logoutUser
} from "../services/AuthService";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile =
  window.innerWidth <= 768;

  const handleLogout = async () => {

    console.log("logout clicked");

    try {
  
      const result = await logoutUser();
      
      console.log(result);

      if (result.success) {
  
        navigate("/", {
          replace: true
        });
  
      }
  
    } catch (error) {
  
      console.log(error);
  
    }
  
  };

  return (
    <div style={{ position: "fixed", zIndex:9999 }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: isMobile
          ? "100%"
          : "70px",
        
          height: isMobile
          ? "calc(70px + env(safe-area-inset-bottom))"
            : "100vh",
        
          position: "fixed",
        
          bottom: isMobile
            ? "0"
            : "auto",
          
          top: isMobile
          ? "auto"
          : "0",
        
          left: "0",
        
          background: "rgba(0,0,0, 0.7)",
        
          backdropFilter: "blur(30px)",
        
          color: "#1e293b",
        
          display: "flex",
        
          flexDirection: isMobile
            ? "row"
            : "column",
        
            alignItems: isMobile
            ? "center"
            : "stretch",
            
          justifyContent: isMobile
            ? "space-around"
            : "flex-start",
        
          paddingTop: isMobile
            ? "0"
            : "20px",
        
          borderRight: isMobile
            ? "none"
            : "1px solid rgba(255,255,255,0.05)",
        
          borderTop: isMobile
            ? "1px solid rgba(255,255,255,0.05)"
            : "none",
        
          }}
      >
        {/* LOGO */}
        <div style={{
          display: isMobile
          ? "none"
          : "flex",
          justifyContent: "center",
          marginBottom: "30px"
        }}>
          <img src={logo} style={{ width: "20px" }} />
        </div>

        {/* MENU */}
        <div style={{ 
          display: "flex",

          flexDirection: isMobile
            ? "row"
            : "column",
        
          justifyContent: isMobile? "space-around": "column",
        
          alignItems: "center",
        
          color: "white",
        
          flex: 1 
          }}>
          <MenuItem icon={<FaHome />} path="/home" current={location.pathname} navigate={navigate} />
          <MenuItem icon={<FaChartBar/>} path="/dashboard" current={location.pathname} navigate={navigate} />
          <MenuItem icon={<FaVideo/>} path="/live-feed" current={location.pathname} navigate={navigate} />
          <MenuItem icon={<FaFileAlt />} path="/activity-log" current={location.pathname} navigate={navigate} />
          <MenuItem icon={<FaCog />} path="/settings" current={location.pathname} navigate={navigate} />
          <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout} current={location.pathname} navigate={navigate}/>
        </div>
        
      </div>
    </div>
  );
}

function MenuItem({ icon, path, current, navigate, onClick }) {
  const active = path && current === path;
    return (
      <div
        onClick={() => {
        
          if (onClick) {
          
            onClick();
          
          } else {
          
            navigate(path);
          
          }
        
        }}      
        style={{
          position: "relative",
          width: "100%",
          height: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
  
          background: active
            ? "linear-gradient(to right, rgba(0,234,255,0.15), transparent)"
            : "transparent",
  
          color: active ? "#00eaff" : "rgba(255,255,255,0.5)",
          transition: "0.2s"
        }}
      >
        {active && (
          <div
            style={{
              position: "absolute",
              right: "0",
              top: "0",
              width: "3px",
              height: "100%",
              background: "#00f3ff",
              boxShadow: "0 0 8px #00f3ff"
            }}
          />
        )}
  
        {/* ICON */}
        <span
          style={{
            fontSize:"16px",  
            lineHeight: "1",       
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </span>
      </div>
    );
  }