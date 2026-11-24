// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA5iI3KzsgsUcGYmRX1D4xQRwZRyCGjGZo',
  authDomain: 'testingforclass-212cf.firebaseapp.com',
  databaseURL: 'https://testingforclass-212cf-default-rtdb.firebaseio.com',
  projectId: 'testingforclass-212cf',
  storageBucket: 'testingforclass-212cf.firebasestorage.app',
  messagingSenderId: '779199630802',
  appId: '1:779199630802:web:3968de1784a54b0ba30c0b',
  measurementId: 'G-C8LRMXX3EC',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };