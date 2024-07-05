// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "authentication-mern-e5405.firebaseapp.com",
  projectId: "authentication-mern-e5405",
  storageBucket: "authentication-mern-e5405.appspot.com",
  messagingSenderId: "1057619508897",
  appId: "1:1057619508897:web:e78a8034cdf6290c8d3ae0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
