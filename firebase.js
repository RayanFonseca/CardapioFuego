// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// 🔥 Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA6rKAs92MVhaxWUqi15cUvadIly5UzDYE",
  authDomain: "casafuegovinhos.firebaseapp.com",
  projectId: "casafuegovinhos",
  storageBucket: "casafuegovinhos.firebasestorage.app",
  messagingSenderId: "692658745171",
  appId: "1:692658745171:web:18f0c44df2d9e8faa7fba6",
  measurementId: "G-60WPYH03GV"
};

// Inicializa o Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
