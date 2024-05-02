// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaCodO2YKO681BHMpK0uOb0xDhbxcYH0E",
  authDomain: "it-sysarch32-store-andrino.firebaseapp.com",
  projectId: "it-sysarch32-store-andrino",
  storageBucket: "it-sysarch32-store-andrino.appspot.com",
  messagingSenderId: "532066507002",
  appId: "1:532066507002:web:212b480fcdfcb963ec9143"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
