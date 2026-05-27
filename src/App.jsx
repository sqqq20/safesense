import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LiveFeed from "./pages/LiveFeed";
import RegisterUser from "./pages/RegisterUser";
import ActivityLog from "./pages/ActivityLog";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import { useEffect } from "react";
import { requestNotificationPermission, listenNotifications } from "./services/NotificationService";


navigator.serviceWorker.register("/firebase-messaging-sw.js")
  .then((reg) => {
    console.log("✅ SW registered:", reg);
  })
  .catch((err) => {
    console.error("❌ SW failed:", err);
  });

function App() {

  useEffect(() => {
    requestNotificationPermission();   // 🔥 ask permission
    listenNotifications();             // 🔥 listen for messages
  }, []);

  return (
    <Router>
      <Routes>
        {/* Login (no sidebar) */}
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<RegisterUser />} />

        <Route
          path="/home" element={<Home />}/>

          {/* Pages with sidebar */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/live-feed"
          element={
            <Layout>
              <LiveFeed />
            </Layout>
          }
        />

        <Route
          path="/activity-log"
          element={
            <Layout>
              <ActivityLog />
            </Layout>
          }
        />

        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;