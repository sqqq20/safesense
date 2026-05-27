import { useEffect, useState } from "react";
import { fetchEvents } from "../services/ActivityService";

export default function ActivityLog() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventType, setEventType] = useState("All Events");

  const itemsPerPage = 4;

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  // Reset page when new data comes
  useEffect(() => {
    setCurrentPage(1);
  }, [events]);

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEvents = events.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  const formatTimestamp = (ts) => {
    if (!ts) return "-";
  
    const date = new Date(ts);
  
    const datePart = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }).toUpperCase();  
  
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  
    return { datePart, timePart };
  };


  const getTypeColor = (riskLevel) => {
    if (riskLevel === "high") return "#ef4444";
    if (riskLevel === "medium") return "#f59e0b";
    return "#22c55e";
  };

  function StatusBadge({ status }) {
    let color = "#94a3b8";
    let bg = "rgba(148,163,184,0.1)";
    let text = status;
  
    if (status === "active") {
      color = "#ef4444";
      bg = "rgba(239,68,68,0.15)";
      text = "PENDING REVIEW";
    }
  
    if (status === "resolved") {
      color = "#22c55e";
      bg = "rgba(34,197,94,0.15)";
      text = "ALERT HANDLED";
    }
  
    if (status === "false_alarm") {
      color = "#f59e0b";
      bg = "rgba(245,158,11,0.15)";
      text = "FALSE ALARM";
    }
  
    return (
      <span style={{
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: "600",
        color: color,
        background: bg,
        border: `1px solid ${color}`
      }}>
        {text}
      </span>
    );
  }

  const handleUpdate = async (id, status) => {
    await fetch(`http://192.168.100.17:5000/update-status/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });
  
    const updated = await fetchEvents();
    setEvents(updated);
  };

  const applyFilters = async () => {

    const url = new URL("http://192.168.100.17:5000/events");
  
    // 🔥 start date
    if (startDate) {
      url.searchParams.append("startDate", startDate);
    }
  
    // 🔥 end date
    if (endDate) {
      url.searchParams.append("endDate", endDate);
    }
  
    // 🔥 event type
    if (eventType !== "All Events") {
      url.searchParams.append(
        "type",
        eventType.toLowerCase()
      );
    }
  
    const res = await fetch(url);
    const data = await res.json();
  
    setEvents(data);
  };

  return (
    <div style={{ padding: "20px", color: "white"}}>

      {/* FILTER BAR */}
      <div style={{
          marginBottom: "20px",
          alignItems: "stretch",

        }}>
          <div style={{
              display: "flex",

              flexWrap: "wrap",
            
              gap: "12px",
            
              alignItems: "flex-end",
            
              width: "100%",
              justifyContent: "flex-start"
          }}>

    {/* START DATE */}
    <div style={filterGroup}>
      <span style={labelStyle}>START DATE</span>
      <input
        type="date"
        style={inputStyle}
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
    </div>

    {/* END DATE */}
    <div style={filterGroup}>
      <span style={labelStyle}>END DATE</span>
      <input
        type="date"
        style={inputStyle}
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
    </div>

    {/* EVENT TYPE */}
    <div style={filterGroup}>
      <span style={labelStyle}>EVENT TYPE</span>
      <select
        style={inputStyle}
        value={eventType}
        onChange={(e) => setEventType(e.target.value)}
      >
        <option>All Events</option>
        <option>ClimbingHigh</option>
        <option>Fall</option>
        <option>Danger</option>
      </select>
    </div>

          <button 
            style={buttonStyle}   
            onClick={applyFilters}          
          >
            APPLY FILTERS
          </button>
        </div>
      </div>

      <div style={{
        overflowX: "auto",
        width: "100%",
        maxWidth: "100vw"
      }}>

      <div style={{
          minWidth: "850px"
        }}>

      <div style={tableContainer}>
      

      {/* TABLE HEADER */}
      <div style={tableHeader}>
        <span style={{ flex: 1.6 }}>Timestamp</span>
        <span style={{ flex: 1.5 }}>Event Type</span>
        <span style={{ flex: 1.5 }}>Status</span>
        <span style={{ flex: 1.5 }}>Actions</span>
        <span style={{ flex: 1.0 }}>Evidence</span>
      </div>

      {/* TABLE BODY */}
      {currentEvents.map((e) => {
        const { datePart, timePart } = formatTimestamp(e.timestamp);
            
        const isActive = e.status === "active";
            
        return (
          <div key={e.id} style={rowStyle}>
          
            {/* TIMESTAMP */}
            <span style={{ flex: 1.6 }}>
              <div style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: "500" }}>
                {datePart}
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                {timePart}
              </div>
            </span>
        
            {/* EVENT TYPE */}
            <span style={{ flex: 1.5, color: getTypeColor(e.riskLevel) }}>
              ● {e.type?.toUpperCase()}
            </span>
        
            {/* STATUS BADGE */}
            <span style={{ flex: 1.5 }}>
              <StatusBadge status={e.status} />
            </span>
        
            {/* ACTION BUTTONS */}
            <span style={{ flex: 1.5 }}>
              {isActive ? (
                <div style={{ display: "flex", gap: "6px" }}>
                  <SmallButton
                    text="Resolved"
                    color="#22c55e"
                    onClick={() => handleUpdate(e.id, "resolved")}
                  />
                  <SmallButton
                    text="False Alarm"
                    color="#f59e0b"
                    onClick={() => handleUpdate(e.id, "false_alarm")}
                  />

                </div>
              ) : (
                <span style={{ color: "#64748b", fontSize: "12px" }}>
                  —
                </span>
              )}
            </span>
            <span style={{ flex: 1.0 }}>
                        
              {e.riskLevel === "medium"? (
              <div style={{ display: "flex", gap: "6px" }}>

                <SmallButton
                  text="Download Clip"
                  color="#3b82f6"
                  onClick={() =>
                    window.open(
                      e.videoUrl,
                      "_blank"
                    )
                  }
                />
                </div>
                
              ) : (
                <span style={{ color: "#64748b", fontSize: "12px" }}>
                  —
                </span>
              )}
            
            </span>
          </div>
        );
      })}
      {events.length === 0 && (
        <p style={{ textAlign: "center", color: "#94a3b8" }}>
          No events found
        </p>
      )}

      {/* PAGINATION */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        margin: "10px",
        gap: "8px"
      }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          style={pageBtn}
        >
          {"<"}
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              ...pageBtn,
              background: currentPage === i + 1 ? "#22d3ee" : "#122635",
              color: currentPage === i + 1 ? "#0f1e2a" : "white"
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          style={pageBtn}
        >
          {">"}
        </button>
      </div>
        </div>
        </div>
        </div>
    </div>
  );
}

function SmallButton({ text, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 8px",
        fontSize: "11px",
        borderRadius: "5px",
        border: "none",
        background: color,
        color: "white",
        cursor: "pointer",
      }}
    >
      {text}
    </button>
  );
}

/* ================= STYLES ================= */

const inputStyle = {
  padding: "10px 14px",
  borderRadius: "5px",
  border: "none",
  background: "#122635",
  color: "white",
  width: "180px"
};

const buttonStyle = {
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  background: "#00f3ff",
  color: "#0f1e2a",
  fontWeight: "600",
  cursor: "pointer",
};

const tableHeader = {
    display: "flex",
    padding: "10px 20px",
    background: "rgba(15, 30, 45, 0.25)",  
    borderRadius: "5px 5px 0 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    color: "#94a3b8",
    fontSize: "11px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    textAlign:"left"
};
  
const rowStyle = {
    display: "flex",
    padding: "10px 20px",   
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(15, 30, 45, 0.95)", 
    alignItems: "center",
    fontSize: "13px",
    textAlign:"left"
};

const pageBtn = {
  padding: "6px 12px",
  borderRadius: "5px",
  border: "none",
  background: "#122635",
  color: "white",
  cursor: "pointer"
};

const tableContainer = {
    //maxWidth: "820px",   
    borderRadius: "5px",
    background: "rgba(10, 25, 40, 0.6)",
    backdropFilter: "blur(8px)"
};

const filterGroup = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };
  
  const labelStyle = {
    fontSize: "9px",
    color: "#00f3ff",
    letterSpacing: "1px",
    fontWeight: "500",
    textTransform: "uppercase",
    textAlign:"left"
  };