import { useContext, createContext, useEffect, useState, useMemo } from "react";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, OAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  const provider1 = new OAuthProvider("apple.com");
  const provider2 = new FacebookAuthProvider();
  provider2.setCustomParameters({
    // display: "popup",
    prompt: "select_account",
  });

  const facebookSignIn = () => {
    return new Promise((resolve, reject) => {
      signInWithPopup(auth, provider2)
        .then((result) => {
          setUser(result.user);
          resolve(result.user);
        })
        .catch((error) => {
          reject(error);
          console.log(error);
        });
    });
  };

  const googleSignIn = () => {
    return new Promise((resolve, reject) => {
      signInWithPopup(auth, provider)
        .then((result) => {
          setUser(result.user);
          resolve(result.user);
        })
        .catch((error) => {
          reject(error);
          console.log(error);
        });
    });
  };

  const appleSignIn = () => {
    return new Promise((resolve, reject) => {
      signInWithPopup(auth, provider1)
        .then((result) => {
          console.log(result);
          const credential = OAuthProvider.credentialFromResult(result);
          console.log(credential);
          setUser(result.user);
          resolve(result.user);
        })
        .catch((error) => {
          reject(error);
          const credential = OAuthProvider.credentialFromError(error);

          console.log(error);
        });
    });
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      //   console.log("User", currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ facebookSignIn, googleSignIn, appleSignIn, logOut, user, setUser, value }}>{children}</AuthContext.Provider>;
};

// export const UserAuth = () => {
//   return useContext(AuthContext);
// };

export default AuthContext;
