import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "@firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-yt8hEVwKQoY_BskbbSVyvz3Kn05M-P8",
  authDomain: "chatapp-1-88005.firebaseapp.com",
  projectId: "chatapp-1-88005",
  storageBucket: "chatapp-1-88005.appspot.com",
  messagingSenderId: "917467200688",
  appId: "1:917467200688:web:b7513b1b456290df814f75"
};

// Initialize App
const app = !firebase.getApps().length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage();

export { db, auth, provider, storage };
