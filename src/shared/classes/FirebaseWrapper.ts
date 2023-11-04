// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import {
    Firestore,
    getFirestore,
    collection,
    CollectionReference,
    addDoc,
    DocumentReference,
    setDoc,
} from "firebase/firestore";
import { GameInfo } from "../types/GameTypes";

export class FirebaseWrapper {
    private app: FirebaseApp;
    private firestore: Firestore;
    private gameCollectionRef: CollectionReference;
    private game: DocumentReference | null;

    constructor() {
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
        this.app = initializeApp(firebaseConfig);
        this.firestore = getFirestore(this.app);
        this.gameCollectionRef = collection(this.firestore, "games");
        this.game = null;
    }

    public async createGame(gameData: GameInfo) {
        this.game = await addDoc(this.gameCollectionRef, gameData);
        console.log("Game created in firebase");
        console.log(this.game.id);
    }

    public async updateGame(gameData: GameInfo) {
        if (this.game) {
            await setDoc(this.game, gameData);
            console.log("updated Game in firebase");
        }
    }
}
