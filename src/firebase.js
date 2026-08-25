import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhmy-_XS2VRpAJn8I0JfVp2jXZZZHAyQo",
  authDomain: "poppins-habitduel.firebaseapp.com",
  projectId: "poppins-habitduel",
  storageBucket: "poppins-habitduel.firebasestorage.app",
  messagingSenderId: "570975659524",
  appId: "1:570975659524:web:05b0cde3ab18c3cc02f751",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
