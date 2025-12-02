// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signOut, createUserWithEmailAndPassword, GithubAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyCvGdDwYMvYVGM8vSYZUqrsGbCsRQZoteM",
    authDomain: "smart-agricultral-assistant.firebaseapp.com",
    databaseUrl:"https://smart-agricultral-assistant-default-rtdb.firebaseio.com/",
    projectId: "smart-agricultral-assistant",
    storageBucket: "smart-agricultral-assistant.firebasestorage.app",
    messagingSenderId: "321440672849",
    appId: "1:321440672849:web:92573cd61daebe6d0c9c70",
    measurementId: "G-W9L9J7KWEP"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser l'authentification Firebase
const auth = getAuth(app);



// Initialiser les services Firebase
const database = getDatabase(app);
export {database}
export const storage = getStorage(app);

// Exporter l'app par défaut
export default app;
export { auth, createUserWithEmailAndPassword, GithubAuthProvider, signOut };