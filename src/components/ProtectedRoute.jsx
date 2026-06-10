import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../services/Firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({ children }) {

  const [user, setUser] = useState(undefined);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(auth, (currentUser) => {

        setUser(currentUser);

      });

    return () => unsubscribe();

  }, []);

  // Checking login state
  if (user === undefined) {

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!user) {

    return <Navigate to="/" replace />;
  }

  // Logged in
  return children;
}