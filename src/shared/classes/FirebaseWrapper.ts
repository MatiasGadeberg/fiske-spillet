// Import the functions you need from the SDKs you need
import type { FirebaseApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import type { Unsubscribe } from "firebase/firestore";
import {
    Firestore,
    getFirestore,
    collection,
    CollectionReference,
    DocumentReference,
    setDoc,
    doc,
    onSnapshot,
    DocumentSnapshot,
    query,
    QuerySnapshot,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import type { GameInfo, TeamInfo } from "../types/GameTypes";

export class FirebaseWrapper {
    private app: FirebaseApp;
    private firestore: Firestore;
    private gameCollectionRef: CollectionReference;
    private game: DocumentReference | null;
    private snapshots: Unsubscribe[];

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
        this.snapshots = [];
    }

    public async setGame(gameData: GameInfo) {
        await setDoc(doc(this.firestore, "games", `fiskespil`), gameData);
    }

    public async setTeam(teamName: string, teamData: { points: number; password: string; salt: string }) {
        await setDoc(doc(this.firestore, "teams", teamName), teamData);
    }

    public async updateTeam(teamData: Partial<TeamInfo>) {
        console.log("Updating team data");
        console.log(teamData);

        const teamRef = doc(this.firestore, "teams", teamData.teamName!);
        await updateDoc(teamRef, teamData);
    }

    public async getTeamData(teamId: string) {
        return await getDoc(doc(this.firestore, "teams", teamId));
    }

    public subscribe(collection: string, document: string, callback: (doc: DocumentSnapshot) => void) {
        const snap = onSnapshot(doc(this.firestore, collection, document), callback);
        this.snapshots.push(snap);
    }

    public subscribeToTeamData(callback: (snapshot: QuerySnapshot) => void) {
        const teamsRef = collection(this.firestore, "teams");
        const q = query(teamsRef);
        const unsubscribe = onSnapshot(q, callback);
        this.snapshots.push(unsubscribe);
    }

    public dropConnections(): void {
        this.snapshots.forEach(snapshot => {
            snapshot();
        });
    }
}
