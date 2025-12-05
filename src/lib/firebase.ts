import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD_0b--6Pc6BdvowIxmKB4tLwvr2zv23-0',
  authDomain: 'novablog-b0b04.firebaseapp.com',
  projectId: 'novablog-b0b04',
  storageBucket: 'novablog-b0b04.firebasestorage.app',
  messagingSenderId: '823580864040',
  appId: '1:823580864040:web:758a65bd506a705a3bcf1d',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
