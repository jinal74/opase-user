importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyCPyiIOXdTS6LfiuUKJiDuhvG7a3z7gjqs",
  authDomain: "opase-5f032.firebaseapp.com",
  projectId: "opase-5f032",
  storageBucket: "opase-5f032.appspot.com",
  messagingSenderId: "285829397938",
  appId: "1:285829397938:web:c94ea8c1e2b1367d9db8ab",
  measurementId: "G-WPXE9H5B09",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: "/logo192.png",
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
