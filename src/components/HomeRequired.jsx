import { useEffect, useState } from "react";
import { auth } from "../services/Firebase";
import { db } from "../services/Firebase";
import { doc, getDoc } from "firebase/firestore";

export default function HomeRequired({ children }) {

  const [loading, setLoading] = useState(true);
  const [hasHome, setHasHome] = useState(false);

  useEffect(() => {

    const checkHome = async () => {

      try {

        const user = auth.currentUser;

        if (!user) {
          setLoading(false);
          return;
        }

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (
          userSnap.exists() &&
          userSnap.data().homeID
        ) {
          setHasHome(true);
        }

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }
    };

    checkHome();

  }, []);

  if (loading) {

    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white"
        }}
      >
        Loading...
      </div>
    );
  }

  if (!hasHome) {

    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "30px",
          color: "white"
        }}
      >
        <h2>No Home Assigned</h2>

        <p>
          You are not currently assigned to any home.
        </p>

        <p>
          Please ask a Home Admin to add you as a member before accessing monitoring features.
        </p>
      </div>
    );
  }

  return children;
}