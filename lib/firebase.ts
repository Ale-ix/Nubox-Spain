import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBQNdoAtMDVIfNvR_6EkhEg0gcXw33D75w",
  authDomain: "nubox-spain.firebaseapp.com",
  projectId: "nubox-spain",
  storageBucket: "nubox-spain.firebasestorage.app",
  messagingSenderId: "785053484106",
  appId: "1:785053484106:web:28a1a57361ba94908c92b3",
  measurementId: "G-JCRHGQWSK6",
}

// Inicializar Firebase solo si no existe ya una instancia
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Inicializar servicios de Firebase
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Solo para desarrollo - conectar emuladores si es necesario
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Puedes descomentar estas líneas si quieres usar emuladores locales
  // try {
  //   connectAuthEmulator(auth, "http://localhost:9099")
  //   connectFirestoreEmulator(db, "localhost", 8080)
  //   connectStorageEmulator(storage, "localhost", 9199)
  // } catch (error) {
  //   console.log("Emulators already connected")
  // }
}

export default app
