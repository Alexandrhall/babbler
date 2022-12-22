// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTW7klYvyxKNg0nzB2t0U-9mxlrQZh7So",
  authDomain: "babbler-af9c3.firebaseapp.com",
  projectId: "babbler-af9c3",
  storageBucket: "babbler-af9c3.appspot.com",
  messagingSenderId: "912756040222",
  appId: "1:912756040222:web:ec60ba1b7f2eb78f69c40f",
  measurementId: "G-7NBZ6GER7B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
// const analytics = getAnalytics(app);
