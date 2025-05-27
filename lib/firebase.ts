import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBQNdoAtMDVIfNvR_6EkhEg0gcXw33D75w",
  authDomain: "nuboxspain.netlify.app",
  projectId: "nubox-spain",
  storageBucket: "nubox-spain.firebasestorage.app",
  messagingSenderId: "785053484106",
  appId: "1:785053484106:web:28a1a57361ba94908c92b3",
  measurementId: "G-JCRHGQWSK6",
}

// Inicializar Firebase solo una vez
let app
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApp()
}

// Inicializar servicios de Firebase
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
