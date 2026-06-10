import { 
    FaBroadcastTower,   
    FaExclamationTriangle, 
    FaBolt 
  } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import detectionImage from "../assets/home1.png"

export default function Home() {
  const navigate = useNavigate();

    return (
      <div style={{
        minHeight: "100vh",
        background: "#000A1B",
        color: "white",
        padding: "60px 80px",
        fontFamily: "sans-serif"
      }}>
  
        {/* HERO SECTION */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap:"40px"
        }}>
  
          {/* LEFT TEXT */}
          <div style={{ flex:" 1 1 400px", maxWidth: "500px",   width: "100%" }}>
  
            <h1 style={{
              fontSize: "43px",
              lineHeight: "1.2",
              marginBottom: "20px",
              textAlign:"left",
              fontWeight:"bold"
            }}>
              SafeSense AI:<br />
              <span style={{ color: "#00f3ff" }}>
                AI-Powered
              </span><br />
              Fall Detection
            </h1>
  
            <p style={{
              color: "rgba(255,255,255,0.6)",
              marginBottom: "30px",
              marginRight:"20px",
              lineHeight: "1.6",
              textAlign:"left"
            }}>
              Real-time human activity monitoring and instant alert system for peace of mind. 
              Experience the future of safety through high-precision neural networks.
            </p>
  
            {/* BUTTONS */}
            <div style={{ display: "flex", gap: "15px" }}>
              <button 
                onClick={() => navigate("/dashboard")}
                style={{
                background: "#39ff14",
                border: "none",
                padding: "12px 20px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
                color:"black"
              }}>
                GO TO DASHBOARD <FaArrowRightLong style={{ fontSize: "14px" }} />
              </button>
  
              <button
                onClick={() => {
                  document
                    .getElementById("features-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }} 
                style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "12px 20px",
                borderRadius: "6px",
                color: "#00f3ff",
                cursor: "pointer"
              }}>
                LEARN MORE
              </button>
            </div>
          </div>
  
          {/* RIGHT IMAGE CARD */}
          <div style={{  
            flex: "1 1 400px",
            display: "flex",
            justifyContent: "center"
          }}>
            <img
              src={detectionImage}
              alt="AI Fall Detection Preview"
              style={{
                height:"auto",
                width: "130%",
                maxWidth: "500px"
              }}
            />
          </div>
  
        </div>
  
        {/* FEATURES SECTION */}
        <div id="features-section" style={{ display: "flex",flexWrap:"wrap", gap: "20px", marginTop: "80px", textAlign:"left" }}>

          <FeatureCard 
            title="Real-time Detection"
            desc="Zero-latency stream processing ensures activity is captured instantly."
            icon={<FaBroadcastTower />}
            color="#00f3ff"   
          />
        
          <FeatureCard 
            title="Fall Detection"
            desc="Advanced skeletal tracking identifies posture changes and immobility."
            icon={<FaExclamationTriangle />}
            color="#fb7185"   
          />
        
          <FeatureCard 
            title="Instant Alerts"
            desc="Multi-channel notification system delivers alerts immediately."
            icon={<FaBolt />}
            color="#39ff14"   
          />
        
        </div>
  
      </div>
    );
  }
  
  function FeatureCard({ title, desc, icon, color }) {
  return (
    <div style={{
      flex: 1,
      padding: "25px",
      borderRadius: "16px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.05)",
      backdropFilter: "blur(10px)",
    }}>

      {/* ICON BOX */}
      <div style={{
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: `${color}20`, 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "15px"
      }}>
        <span style={{
          color: color,
          fontSize: "18px",
          lineHeight: "1",            
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {icon}
        </span>
      </div>

      <h3 style={{ marginBottom: "10px" }}>{title}</h3>

      <p style={{
        fontSize: "14px",
        color: "rgba(255,255,255,0.6)",
        lineHeight: "1.5"
      }}>
        {desc}
      </p>
    </div>
  );
}