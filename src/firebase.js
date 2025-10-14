// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1IcVmtNl1qs3T3oHIJfxG9DNVM6K370k",
    authDomain: "movie-tracker-875e5.firebaseapp.com",
    projectId: "movie-tracker-875e5",
    storageBucket: "movie-tracker-875e5.firebasestorage.app",
    messagingSenderId: "273552178067",
    appId: "1:273552178067:web:2345d88cbd852c1d8cc666"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);