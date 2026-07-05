import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
  } from "recharts";

export default function Dashboard() {

  const [events, setEvents] = useState([]);
  const [systemStatus, setSystemStatus] = useState("SAFE");

  useEffect(() => {

    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://192.168.100.17:5000/events");
        const data = await res.json();

        setEvents(data);

        // SYSTEM STATUS
        if (data.length > 0) {
          const latest = data[0];

          if (latest.status === "active") {
            if (latest.type === "danger") {
              setSystemStatus("EMERGENCY");
            }
            else if (latest.type === "fall") {
              setSystemStatus("WARNING");
            }
            else {
              setSystemStatus("SAFE");
            }
          }
          else {
            setSystemStatus("SAFE");
          }
        }
        else {
          setSystemStatus("SAFE");
        }

      } catch (err) {
        console.log(err);
      }
    };

    fetchDashboard();

    const interval = setInterval(fetchDashboard, 2000);

    return () => clearInterval(interval);

  }, []);


  // =========================
  // COUNTS
  // =========================

  const totalEvents = events.length;

  const today = new Date().toDateString();

  const todayEvents = events.filter((e) => {
    if (!e.timestamp) return false;

    return new Date(e.timestamp).toDateString() === today;
  }).length;


  const resolvedCount = events.filter(
    (e) => e.status === "resolved"
  ).length;


  const pendingCount = events.filter(
    (e) => e.status === "active"
  ).length;

    // =========================
  // WEEKLY TREND
  // =========================

  const weeklyData = [];

  for (let i = 6; i >= 0; i--) {

    const date = new Date();
    date.setDate(date.getDate() - i);

    const dayName = date.toLocaleDateString("en-US", {
      weekday: "short"
    });

    const count = events.filter((e) => {

      if (!e.timestamp) return false;

      const eventDate = new Date(e.timestamp);

      return (
        eventDate.toDateString() === date.toDateString()
      );

    }).length;

    weeklyData.push({
      day: dayName,
      events: count
    });
  }
  // =========================
  // LAST EVENT TIME
  // =========================

  const lastEventTime = events.length > 0
    ? new Date(events[0].timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    : "--:--";


  // =========================
  // STATUS COLOR
  // =========================

  const getStatusColor = () => {
    if (systemStatus === "EMERGENCY") return "#ef4444";
    if (systemStatus === "WARNING") return "#f59e0b";
    return "#22c55e";
  };


  return (

    <div
      style={{
        padding: "25px",
        color: "white",
        minHeight: "100vh"
      }}
    >

      {/* HEADER */}
      <div style={{ marginBottom: "25px" }}>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: getStatusColor()
            }}
          />

          <span
            style={{
              color: getStatusColor(),
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            SYSTEM STATUS: {systemStatus}
          </span>
        </div>

      </div>


      {/* TOP CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "18px",
          marginBottom: "25px"
        }}
      >

        <DashboardCard
          title="TOTAL EVENTS"
          value={totalEvents}
          subtitle="All recorded alerts"
        />

        <DashboardCard
          title="TODAY'S EVENTS"
          value={todayEvents}
          subtitle="Detected today"
        />

        <DashboardCard
          title="LAST ALERT"
          value={lastEventTime}
          subtitle="Most recent event"
        />

        <DashboardCard
          title="PENDING REVIEW"
          value={pendingCount}
          subtitle="Require attention"
        />

      </div>


      {/* LOWER SECTION */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >

        {/* WEEKLY EVENT TREND */}
        <div style={panelStyle}>

        <div style={panelTitle}>
          WEEKLY EVENT TREND
        </div>

        <div
          style={{
            color: "#64748b",
            fontSize: "11px",
            marginTop: "4px",
            marginBottom: "20px"
          }}
        >
          Detected alerts in the past 7 days
        </div>
        
        <div style={{ width: "100%", height: "80%" }}>
      
          <ResponsiveContainer>
        
            <AreaChart data={weeklyData}>
        
              <defs>
                <linearGradient
                  id="colorEvents"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#22d3ee"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#22d3ee"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
        
              <XAxis
                dataKey="day"
                stroke="#64748b"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />

              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  color: "white"
                }}
              />

              <Area
                type="monotone"
                dataKey="events"
                stroke="#22d3ee"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorEvents)"
              />

            </AreaChart>
              
          </ResponsiveContainer>
              
        </div>
              
        </div>


        {/* SUMMARY PANEL */}
        <div style={panelStyle}>

          <div style={panelTitle}>SUMMARY</div>

          <div
            style={{
              marginTop: "25px",
              display: "flex",
              flexDirection: "column",
              gap: "18px"
            }}
          >

            <SummaryItem
              label="Resolved Alerts"
              value={resolvedCount}
              color="#22c55e"
            />

            <SummaryItem
              label="Pending Alerts"
              value={pendingCount}
              color="#ef4444"
            />

            <SummaryItem
              label="System Health"
              value={systemStatus}
              color={getStatusColor()}
            />

          </div>

        </div>

      </div>

    </div>
  );
}


// =========================
// CARD COMPONENT
// =========================

function DashboardCard({ title, value, subtitle }) {
  return (
    <div
      style={{
        background: "rgba(15,30,45,0.85)",
        borderRadius: "10px",
        padding: "22px",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(8px)"
      }}
    >

      <div
        style={{
          color: "#94a3b8",
          fontSize: "11px",
          letterSpacing: "1px",
          marginBottom: "16px"
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "36px",
          fontWeight: "700",
          marginBottom: "8px"
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#22c55e",
          fontSize: "12px"
        }}
      >
        {subtitle}
      </div>

    </div>
  );
}


// =========================
// SUMMARY ITEM
// =========================

function SummaryItem({ label, value, color }) {
  return (
    <div>

      <div
        style={{
          color: "#94a3b8",
          fontSize: "12px",
          marginBottom: "6px"
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: color,
          fontSize: "26px",
          fontWeight: "700"
        }}
      >
        {value}
      </div>

    </div>
  );
}


// =========================
// STYLES
// =========================

const panelStyle = {
  background: "rgba(15,30,45,0.85)",
  borderRadius: "10px",
  padding: "22px",
  border: "1px solid rgba(255,255,255,0.06)",
  backdropFilter: "blur(8px)"
};

const panelTitle = {
  color: "#94a3b8",
  fontSize: "12px",
  letterSpacing: "1px"
};
