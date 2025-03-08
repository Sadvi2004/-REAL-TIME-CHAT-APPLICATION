import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCRm2gbETkpztwz6vUEwFCupRrgV4MDbhY",
    authDomain: "chat-application-ea225.firebaseapp.com",
    projectId: "chat-application-ea225",
    storageBucket: "chat-application-ea225.firebasestorage.app",
    messagingSenderId: "939237066094",
    appId: "1:939237066094:web:049183ba500e2e76096d7f",
    measurementId: "G-GTJXHJ64DM"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
