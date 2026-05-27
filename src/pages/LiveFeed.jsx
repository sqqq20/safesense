import { useEffect, useState } from "react";
import WebRTCPlayer from "../components/WebRTCPlayer";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();
  const [status, setStatus] = useState("Normal");
  const [risk, setRisk] = useState("low");
  const [currentEventId, setCurrentEventId] = useState(null);
  const [actionTaken, setActionTaken] = useState(false);
  const [updating, setUpdating] = useState(false);
  const isMobile =
  window.innerWidth <= 768;

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("http://192.168.100.17:5000/events");
      const alerts = await res.json();
    
      if (!alerts || alerts.length === 0) {
        setStatus("Normal");
        setRisk("low");
        setCurrentEventId(null);
        setActionTaken(false);
        return;
      }

      const latest = alerts[0];
      
      if (latest.status === "resolved" || latest.status === "false_alarm") {
        setStatus("Normal");
        setRisk("low");
        setActionTaken(true);
        return;
      }

      // 🔥 RESET action if new event
      if (latest.id !== currentEventId) {
        setCurrentEventId(latest.id);
        setActionTaken(false);
      }

      if (latest.type === "danger") {
        setStatus("Emergency");
      } else if (latest.type === "fall") {
        setStatus("Fall Detected");
      } else if (latest.type === "climbinghigh") {
        setStatus("Climbing High")
      } else {
        setStatus("Normal");
      }

      setRisk(latest.riskLevel || "low");

    }, 1000);

    return () => clearInterval(interval);
  }, [currentEventId]);

  // 🔥 COLOR
  const getStatusColor = () => {
    if (status === "Emergency") return "#ef4444";
    if (status === "Fall Detected") return "#f59e0b";
    if (status === "Climbing High") return "#f59e0b";
    return "#22c55e";
  };

  const getRiskColor = () => {
    if (risk === "high") return "#ef4444";
    if (risk === "medium") return "#f59e0b";
    return "#22c55e";
  };

  // 🔥 ENABLE LOGIC
  const isActionAllowed = status !== "Normal" && !actionTaken && !updating;

  // 🔥 HANDLE CLICK
  const handleUpdate = async (newStatus) => {
    if (!currentEventId || updating || actionTaken) return;

    setUpdating(true);

    try {
      await fetch(`http://192.168.100.17:5000/update-status/${currentEventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      // 🔥 INSTANT UI UPDATE
      setStatus("Normal");
      setRisk("low");
      setActionTaken(true);

    } catch (err) {
      console.error("Update failed:", err);
    }

    setUpdating(false);
  };

  return (
    <div style={{
      margin:"10px",
      padding: "10px",
      display: "flex",
      justifyContent: "center"
    }}>

      <div style={{
        width: "100%",
        maxWidth: "750px",
        background: "#0f1e2a",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden"
      }}>

        {/* HEADER */}
        <div style={{
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "#122635"
        }}>
          <FaUser color="#38bdf8" size={20} />
          <span style={{ color: "#e2e8f0", fontWeight: "500" }}>
            Live Monitoring
          </span>
        </div>

        {/* MAIN */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          padding: "15px",
          gap: "15px"
        }}>

          {/* VIDEO */}
          <div style={{
            flex: "1 1 400px",
            background: "black",
            borderRadius: "6px",
            overflow: "hidden"
          }}>
            <WebRTCPlayer />
          </div>

          {/* INFO */}
          <div style={{
            flex: "1 1 25%",
            display: "flex",
            flexDirection: isMobile? "row" : "column",
            gap: "12px"
          }}>

            <InfoBlock label="Location" value="Scene 1" />

            <InfoBlock 
              label="Status" 
              value={status} 
              color={getStatusColor()} 
            />

            <InfoBlock 
              label="Risk" 
              value={risk.toUpperCase()} 
              color={getRiskColor()} 
            />

          </div>
        </div>

        {/* BUTTONS */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          padding: "15px",
          borderTop: "1px solid rgba(255,255,255,0.08)"
        }}>
          <ActionButton 
            text="Resolved" 
            color="#22c55e"
            disabled={!isActionAllowed}
            onClick={() => handleUpdate("resolved")}
          />

          <ActionButton 
            text="False Alarm" 
            color="#ef4444"
            disabled={!isActionAllowed}
            onClick={() => handleUpdate("false_alarm")}
          />

          <ActionButton 
            text="View Activity" 
            color="#3b82f6"
            onClick={() => navigate("/activity-log")}
          />
        </div>

      </div>
    </div>
  );
}


function InfoBlock({ label, value, color }) {
  return (
    <div style={{
      flex: 1,
      padding: "10px",
      background: "#122635",
      borderRadius: "6px"
    }}>
      <div style={{
        fontSize: "12px",
        color: "#94a3b8"
      }}>
        {label}
      </div>
      <div style={{
        marginTop: "4px",
        color: color || "#e2e8f0",
        fontWeight: "500"
      }}>
        {value}
      </div>
    </div>
  );
}


function ActionButton({ text, color, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 18px",
        borderRadius: "6px",
        border: "none",
        background: disabled ? "#555" : color,
        color: "white",
        fontWeight: "500",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1
      }}
    >
      {text}
    </button>
  );
}