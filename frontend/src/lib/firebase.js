import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC80TMlRcf97mNJZxaZ0QIkNZIVDU88ihk",
  authDomain: "bloodlink-b84d5.firebaseapp.com",
  projectId: "bloodlink-b84d5",
  storageBucket: "bloodlink-b84d5.firebasestorage.app",
  messagingSenderId: "979513870498",
  appId: "1:979513870498:web:1fb99f523070e34f0c6ffb",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
