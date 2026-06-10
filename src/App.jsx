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
import HomeRequired from "./components/HomeRequired";
import ProtectedRoute from "./components/ProtectedRoute";

navigator.serviceWorker.register("/firebase-messaging-sw.js")
  .then((reg) => {
    console.log("✅ SW registered:", reg);
  })
  .catch((err) => {
    console.error("❌ SW failed:", err);
  });

function App() {

  useEffect(() => {
    requestNotificationPermission();   
    listenNotifications();            
  }, []);

  return (
    <Router>
      <Routes>
        {/* Login (no sidebar) */}
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<RegisterUser />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <HomeRequired>
                  <Dashboard />
                </HomeRequired>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/live-feed"
          element={
            <ProtectedRoute>
              <Layout>
                <HomeRequired>
                  <LiveFeed />
                </HomeRequired>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/activity-log"
          element={
            <ProtectedRoute>
              <Layout>
                <HomeRequired>
                  <ActivityLog />
                </HomeRequired>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;