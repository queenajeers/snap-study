// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

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
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
