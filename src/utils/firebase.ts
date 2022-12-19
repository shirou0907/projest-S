// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDeS49BFoFIywh5UyLQ_0CRsfyT_i5_Nz8',
  authDomain: 'graduation-project-56ec3.firebaseapp.com',
  projectId: 'graduation-project-56ec3',
  storageBucket: 'graduation-project-56ec3.appspot.com',
  messagingSenderId: '95163466415',
  appId: '1:95163466415:web:e77190ae4fc2a91d038a5a',
  measurementId: 'G-GN1RYD5TX4',
}

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)
auth.languageCode = 'it'

export { db, auth }
