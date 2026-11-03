import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCPyiIOXdTS6LfiuUKJiDuhvG7a3z7gjqs",
  authDomain: "opase-5f032.firebaseapp.com",
  projectId: "opase-5f032",
  storageBucket: "opase-5f032.appspot.com",
  messagingSenderId: "285829397938",
  appId: "1:285829397938:web:c94ea8c1e2b1367d9db8ab",
  measurementId: "G-WPXE9H5B09",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

export const auth = getAuth(app);
export { db, storage };

const provider = new GoogleAuthProvider();
const provider1 = new OAuthProvider("apple.com");
provider.setCustomParameters({
  prompt: "select_account",
});

provider1.setCustomParameters({
  login_hint: "select_account",
});

export const googleSignIn = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      console.log("sjglierahghietnagoethg8or7eyg8oherIOHGHUI");
    })
    .catch((error) => {
      console.log(error);
    });
};

export const appleSignIn = () => {
  signInWithPopup(auth, provider1)
    .then((result) => {
      console.log(result, "gdaufguedgf");
      const user = result.user;

      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const idToken = credential.idToken;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      const email = error.customData.email;

      const credential = OAuthProvider.credentialFromError(error);
    });
};

export const getTokenFirebase = () => {
  return getToken(messaging, { vapidKey: "BCe6kH3vUo0OFcJ1Z7P1BuKeMb98apm5Uy5eSCL41uj6jiHzPJkfouKsrKDHypNMsOa86pIfKSxQOGqUEKSCSB8" })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        return currentToken;
      } else {
        console.log("No registration token available. Request permission to generate one.");
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};
