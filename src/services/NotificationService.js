import { getToken } from "firebase/messaging";
import { messaging } from "./Firebase";
import { auth } from "./Firebase";
import { onAuthStateChanged } from "firebase/auth";

export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BFI4CjyTbepk6aYhiC8qKnfPHSnUm5xDuMvZHT7bx60NdOTw5s7Pe2dJoTobKBo0A4TEW_L3byU3awnBXRhlIBM"
    });

    console.log("FCM Token:", token);

    onAuthStateChanged(auth, async(user) => {
      if(!user) {
        console.log("No user logged in");
        return;
      }
      console.log("UID:", user.uid);
      // SEND TOKEN TO BACKEND
      await fetch("http://192.168.100.17:5000/register-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token,uid: user.uid })
      });
    })
      
  }
};

import { onMessage } from "firebase/messaging";

export const listenNotifications = () => {
    onMessage(messaging, (payload) => {
        console.log("🔥 RECEIVED:", payload);
      
          navigator.serviceWorker.getRegistration().then((reg) => {
            if (reg) {
              reg.showNotification(payload.data.title, {
                body: payload.data.body,
                tag:"alert",
                renotify:true
              });
            }
          });
      });
}