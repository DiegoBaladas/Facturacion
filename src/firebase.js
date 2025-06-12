import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFzBJRC7lYeCerjLxjeKYXZNrn4US_IZk",
  authDomain: "facturacion-app-1998.firebaseapp.com",
  projectId: "facturacion-app-1998",
  storageBucket: "facturacion-app-1998.firebasestorage.app",
  messagingSenderId: "690404080300",
  appId: "1:690404080300:web:eb95f7f838a6b7bb8dbd09"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
