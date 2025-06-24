import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyALC_18DAFuKN04BiQMYTzZp2Vn-YERB0M',
  authDomain: 'bntds-9ac54.firebaseapp.com',
  projectId: 'bntds-9ac54',
  storageBucket: 'bntds-9ac54.firebasestorage.app',
  messagingSenderId: '1081421508479',
  appId: '1:1081421508479:web:543d89287c3ba1355fb44a',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
