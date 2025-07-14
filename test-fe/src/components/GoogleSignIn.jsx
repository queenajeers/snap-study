// src/components/GoogleSignIn.jsx
import React, { useState, useEffect } from "react";
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "../firebaseInit";

const GoogleSignIn = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("❌ Sign-in error:", error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("❌ Sign-out error:", error.message);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>👋 Hello, {user.displayName}</p>
          <p>👋 Uid, {user.uid}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleSignIn}>Sign In with Google</button>
      )}
    </div>
  );
};

export default GoogleSignIn;
