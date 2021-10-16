import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyCEQU5ZyvMYwEBREI6eim_htRgCofTudGs",
    authDomain: "instagram-clone-rn-64dc6.firebaseapp.com",
    projectId: "instagram-clone-rn-64dc6",
    storageBucket: "instagram-clone-rn-64dc6.appspot.com",
    messagingSenderId: "841995889073",
    appId: "1:841995889073:web:7397f6ac006fa484d2b590"
}

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = firebase.firestore();
const storage = firebase.storage();

export { firebase, db, storage }