// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCxODzkTfqeKQfeL6okRzkBeRq_dDYfvI",
  authDomain: "tenuity-491.firebaseapp.com",
  projectId: "tenuity-491",
  storageBucket: "tenuity-491.firebasestorage.app",
  messagingSenderId: "350117112199",
  appId: "1:350117112199:web:a2079d36f42b1f341bcb22",
  measurementId: "G-P28PRYBMQH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
