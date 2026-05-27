import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyA5Qk1IeiLbzKCumPKt-eXiNm80ehgq6Wk",
    authDomain: "safesense-40a5b.firebaseapp.com",
    projectId: "safesense-40a5b",
    storageBucket: "safesense-40a5b.firebasestorage.app",
    messagingSenderId: "299895992204",
    appId: "1:299895992204:web:a24b585567e3a938b530a9",
    measurementId: "G-V1RD88DTE2"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);