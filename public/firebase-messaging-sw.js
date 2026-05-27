// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyA5Qk1IeiLbzKCumPKt-eXiNm80ehgq6Wk",
    authDomain: "safesense-40a5b.firebaseapp.com",
    projectId: "safesense-40a5b",
    messagingSenderId: "299895992204",
    appId: "1:299895992204:web:a24b585567e3a938b530a9",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {

  console.log("🔔 Background message:", payload);

  const title = payload.data.title;

  const options = {

    body: payload.data.body,

    icon: "/warning.png",

    badge: "/warning.png",

    requireInteraction: true,

    vibrate: [300, 100, 300],

    tag: "safesense-alert",

    renotify: true

  };

  self.registration.showNotification(title, options);

});