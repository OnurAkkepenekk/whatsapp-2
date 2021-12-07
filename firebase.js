import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmrSpe3ccuoarPVV7okBjciSBF5Z6RFJc",
  authDomain: "whatsapp-2-b22a6.firebaseapp.com",
  projectId: "whatsapp-2-b22a6",
  storageBucket: "whatsapp-2-b22a6.appspot.com",
  messagingSenderId: "943235218354",
  appId: "1:943235218354:web:832cd1616c3b08a7f3c2ab",
};

// Initialize App
const app = !firebase.getApps().length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
