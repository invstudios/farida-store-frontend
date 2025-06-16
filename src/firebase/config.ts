// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "quiz-2273d.firebaseapp.com",
  projectId: "quiz-2273d",
  storageBucket: "quiz-2273d.firebasestorage.app",
  messagingSenderId: "933693124598",
  appId: "1:933693124598:web:c4535d6bab4486d026a1d7",
  measurementId: "G-NNE70ZYM2C"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
