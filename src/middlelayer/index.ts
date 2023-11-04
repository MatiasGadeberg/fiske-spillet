// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Firestore, addDoc, collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBm8KO8rDc0dxGqrIlvSVozOfgbnU6Rze8",
    authDomain: "vm-fiskespillet.firebaseapp.com",
    projectId: "vm-fiskespillet",
    storageBucket: "vm-fiskespillet.appspot.com",
    messagingSenderId: "402889246876",
    appId: "1:402889246876:web:9e13d7ae6f2c33b8380559",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createGame(db: Firestore) {
    const colRef = collection(db, "games");
    const docRef = await addDoc(colRef, {
        serverTime: 1,
        currentNumberOfTeams: 0,
        gameState: "not-started",
        timeToEndInMs: 100,
        timeToStartInMs: 0,
        fishMarketInfo: [],
        fishingAreaInfo: [],
    });
    console.log(colRef);
    console.log(docRef);
}

createGame(db);
