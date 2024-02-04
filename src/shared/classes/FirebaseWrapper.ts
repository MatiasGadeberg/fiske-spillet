import type { FirebaseApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import {
    Firestore,
    Unsubscribe,
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
    addDoc,
    DocumentData,
} from "firebase/firestore";
import type { EventData, GameInfo, TeamInfo } from "../types/GameTypes";

export class FirebaseWrapper {
    private app: FirebaseApp;
    private firestore: Firestore;
    private gameCollectionRef: CollectionReference;
    private game: DocumentReference | null;
    private snapshots: Unsubscribe[];

    constructor() {
        const firebaseConfig = {
            apiKey: "AIzaSyBm8KO8rDc0dxGqrIlvSVozOfgbnU6Rze8",
            authDomain: "vm-fiskespillet.firebaseapp.com",
            projectId: "vm-fiskespillet",
            storageBucket: "vm-fiskespillet.appspot.com",
            messagingSenderId: "402889246876",
            appId: "1:402889246876:web:9e13d7ae6f2c33b8380559",
        };

        this.app = initializeApp(firebaseConfig);
        this.firestore = getFirestore(this.app);
        this.gameCollectionRef = collection(this.firestore, "games");
        this.game = null;
        this.snapshots = [];
    }

    public async setGame(gameData: GameInfo) {
        await setDoc(doc(this.firestore, "games", `fiskespil`), gameData);
    }

    public async setTeam(teamName: string, teamData: { points: number; password: string }) {
        console.log("Creating team");
        const test = await setDoc(doc(this.firestore, "teams", teamName), teamData);
        console.log(test);
        console.log("Team created");
    }

    public async updateTeamData(teamName: string, teamData: Partial<TeamInfo>) {
        console.log("Updating team data");
        console.log(teamData);

        const teamRef = doc(this.firestore, "teams", teamName);
        await updateDoc(teamRef, teamData);
    }

    public async getTeamData(teamId: string) {
        const document = await getDoc(doc(this.firestore, "teams", teamId));
        return document.data() as TeamInfo;
    }

    public async sendEvent(eventData: EventData) {
        await addDoc(collection(this.firestore, "events"), eventData);
    }

    public subscribeToEvents(callback: (events: EventData[]) => void) {
        const eventsRef = collection(this.firestore, "events");
        const q = query(eventsRef);
        const unsubscribe = onSnapshot(q, snapshot => {
            const events = snapshot.docChanges().reduce<EventData[]>((eventArr, change) => {
                if (change.type === "added") {
                    eventArr.push(change.doc.data() as EventData);
                }
                return eventArr;
            }, []);

            callback(events);
        });
        this.snapshots.push(unsubscribe);
    }

    public subscribe(collection: string, document: string, callback: (doc: DocumentSnapshot) => void) {
        const snap = onSnapshot(doc(this.firestore, collection, document), callback);
        this.snapshots.push(snap);
    }

    public subscribeToTeamsData(callback: (snapshot: QuerySnapshot) => void) {
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
