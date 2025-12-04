// firebaseClient.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD2KSTvxrumY6n29OZx_3D4861PfzyQnEI",
    authDomain: "godzilla-95bf1.firebaseapp.com",
    projectId: "godzilla-95bf1",
    storageBucket: "godzilla-95bf1.firebasestorage.app",
    messagingSenderId: "529422424716",
    appId: "1:529422424716:web:911f1b61f015c4463a79a9",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
