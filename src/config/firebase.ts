// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCeH1mcHYE6KhD-dixu7TpaDslHXVnPQ9A",
    authDomain: "fir-course-13444.firebaseapp.com",
    projectId: "fir-course-13444",
    storageBucket: "fir-course-13444.appspot.com",
    messagingSenderId: "381835988647",
    appId: "1:381835988647:web:68f9871a050b4154d21582",
    measurementId: "G-P18ER1SVB5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const storage = getStorage(app);
