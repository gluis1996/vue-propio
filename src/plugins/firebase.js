// src/plugins/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCwGwKSI-drBtvd5JJWhnNyTwBkG4OAlvM",
  authDomain: "loginfire-a5e4a.firebaseapp.com",
  projectId: "loginfire-a5e4a",
  storageBucket: "loginfire-a5e4a.firebasestorage.app",
  messagingSenderId: "512947381781",
  appId: "1:512947381781:web:2004b9beb3cd3d5f88501c"
};

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)

export { auth }