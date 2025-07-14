// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref, push, set } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdTV3PerDdzLa0rUevPdtLOYbvXsY4KZk",
  authDomain: "medicalstudytool.firebaseapp.com",
  projectId: "medicalstudytool",
  storageBucket: "medicalstudytool.firebasestorage.app",
  messagingSenderId: "471998377523",
  appId: "1:471998377523:web:36c22c6f1128201395fd46",
  measurementId: "G-X54Y1TNQ90",
  databaseURL:
    "https://medicalstudytool-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

const provider = new GoogleAuthProvider();

export {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  database,
  ref,
  push,
  set,
  storage,
};
