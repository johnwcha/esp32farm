import { initializeApp } from "firebase/app"
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getFunctions } from 'firebase/functions';
// import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
    apiKey: "AIzaSyCNbiEffHhL4QjYpA38NgbXHAWG3WwVI9s",
    authDomain: "esp32farm.firebaseapp.com",
    projectId: "esp32farm",
    storageBucket: "esp32farm.appspot.com",
    messagingSenderId: "412292695558",
    appId: "1:412292695558:web:d2eaea78caeb14aa15a587",
    measurementId: "${config.measurementId}"
}
// const apps = getApps()
// if (!apps.length) {
//     firebaseApp = initializeApp(firebaseConfig)
// } else {
//     firebaseApp = apps[0]
// }

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
const auth = getAuth(app)

const db = getFirestore(app)

const functions = getFunctions(app);

function login() {
  signInAnonymously(auth).then(() => {
      // Signed in..
    }).catch((error) => {
      // const errorCode = error.code;
      console.log(error.message)
      // ...
    })
}

onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log('user logged in')
  } else {
    console.log('not logged in')
    login()
  }
})
export { db }