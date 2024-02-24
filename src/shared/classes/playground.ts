import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    onSnapshot,
    query,
    where,
    QuerySnapshot,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBm8KO8rDc0dxGqrIlvSVozOfgbnU6Rze8",
    authDomain: "vm-fiskespillet.firebaseapp.com",
    projectId: "vm-fiskespillet",
    storageBucket: "vm-fiskespillet.appspot.com",
    messagingSenderId: "402889246876",
    appId: "1:402889246876:web:9e13d7ae6f2c33b8380559",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const callback = (snapshot: QuerySnapshot) => {
    snapshot.forEach(doc => {
        console.log(doc.data())
    })
}


const collectionRef = collection(firestore, "boats");
const q = query(collectionRef, where("teamId", "==", "hest"));
onSnapshot(q, callback);

