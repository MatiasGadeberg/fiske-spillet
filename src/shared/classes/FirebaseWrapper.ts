import type { FirebaseApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import {
    Firestore,
    type Unsubscribe,
    getFirestore,
    collection,
    setDoc,
    doc,
    onSnapshot,
    DocumentSnapshot,
    query,
    QuerySnapshot,
    getDoc,
    updateDoc,
    addDoc,
    where,
} from "firebase/firestore";
import type { BoatAndAreaInfo, BoatBuyEvent, BoatInfo, BoatSailEvent, Boats, EventData, FishMarket, FishSellEvent, GameInfo, LoginEvent, LogoutEvent, NumberOfTeams, TeamInfo } from "../types/GameTypes";

export class FirebaseWrapper {
    private app: FirebaseApp;
    private firestore: Firestore;
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
        this.snapshots = [];
    }

    public async setGame(gameData: GameInfo) {
        await setDoc(doc(this.firestore, "game", `fiskespil`), gameData);
    }

    public subscribeToGameData(callback: (data: GameInfo) => void) {
        const snap = onSnapshot(doc(this.firestore, 'game', 'fiskespil'), (doc: DocumentSnapshot) => {
            if (doc.exists()) {
                callback(doc.data() as GameInfo)
            }
        });
        this.snapshots.push(snap);
    }

    public async setFishMarket(marketInfo: FishMarket) {
        await setDoc(doc(this.firestore, "game", "fishMarket"), marketInfo);
    }

    public subscribeToFishMarket(callback: (data: FishMarket) => void) {
        const snap = onSnapshot(doc(this.firestore, 'game', 'fishMarket'), (doc: DocumentSnapshot) => {
            if (doc.exists()) {
                callback(doc.data() as FishMarket)
            }
        });
        this.snapshots.push(snap);
    }

    public async setAreaInfo(areaInfo: BoatAndAreaInfo) {
        await setDoc(doc(this.firestore, "game", "boatAndAreaInfo"), areaInfo);
    }

    public subscribeToAreaInfo(callback: (data: BoatAndAreaInfo) => void) {
        const snap = onSnapshot(doc(this.firestore, 'game', 'boatAndAreaInfo'), (doc: DocumentSnapshot) => {
            if (doc.exists()) {
                callback(doc.data() as BoatAndAreaInfo)
            }
        });
        this.snapshots.push(snap);
    }
    
    public async setNumberOfTeams(numberOfTeams: NumberOfTeams) {
        await setDoc(doc(this.firestore, "game", "numberOfTeams"), numberOfTeams);
    }

    public subscribeToNumberOfTeams(callback: (data: NumberOfTeams) => void) {
        const snap = onSnapshot(doc(this.firestore, 'game', 'numberOfTeams'), (doc: DocumentSnapshot) => {
            if (doc.exists()) {
                callback(doc.data() as NumberOfTeams)
            }
        });
        this.snapshots.push(snap);
    }

    public async setTeam(teamId: string, teamData: TeamInfo) {
        await setDoc(doc(this.firestore, "teams", teamId), teamData);
    }

    public async updateTeamData(teamId: string, teamData: Partial<TeamInfo>) {
        const teamRef = doc(this.firestore, "teams", teamId);
        await updateDoc(teamRef, teamData);
    }

    public async getTeamData(teamId: string) {
        const document = await getDoc(doc(this.firestore, "teams", teamId));
        return document.data() as TeamInfo;
    }

    public async sendEvent(eventData: EventData) {
        await addDoc(collection(this.firestore, "events"), eventData);
    }

    public async createBoat(data: { type: Boats; teamId: string; speed: number, name: string}) {
        const boatData: Omit<BoatInfo, 'boatId'> = {
            teamId: data.teamId,
            type: data.type,
            speed: data.speed,
            name: data.name,
            inUse: false,
            timeToDestinationInMs: 0,
            destination: null,
            status: 'docked',
            cargo: []
        }

        return await addDoc(collection(this.firestore, "boats"), boatData)
    }

    public async updateBoatData(boatId: string, boatData: Partial<BoatInfo>) {
        const boatRef = doc(this.firestore, "boats", boatId);
        await updateDoc(boatRef, boatData);
    }

    public subscribeToEvents<T extends EventData>(callback: (events: T[]) => void, eventType: string = '') {
        const eventsRef = collection(this.firestore, "events");
        const q = query(eventsRef, where('type', '==', eventType));
        const unsubscribe = onSnapshot(q, snapshot => {
            const events = snapshot.docChanges().reduce<T[]>((eventArr, change) => {
               if (change.type === "added") {
                   eventArr.push(change.doc.data() as T);
               }
               return eventArr;
           }, []);

           callback(events);
        });
        this.snapshots.push(unsubscribe);
    }

    public subscribeToFishSellEvents(callback: (events: FishSellEvent[]) => void) {
        this.subscribeToEvents<FishSellEvent>(callback, 'sell')
    }

    public subscribeToBoatBuyEvents(callback: (events: BoatBuyEvent[]) => void) {
        this.subscribeToEvents<BoatBuyEvent>(callback, 'buy')
    }

    public subscribeToBoatSailEvents(callback: (events: BoatSailEvent[]) => void) {
        this.subscribeToEvents<BoatSailEvent>(callback, 'sail')
    }

    public subscribeToLoginEvents(callback: (events: LoginEvent[]) => void) {
        this.subscribeToEvents<LoginEvent>(callback, 'login')
    }

    public subscribeToLogoutEvents(callback: (events: LogoutEvent[]) => void) {
        this.subscribeToEvents<LogoutEvent>(callback, 'logout')
    }

    public subscribe(collection: string, document: string, callback: (doc: DocumentSnapshot) => void) {
        const snap = onSnapshot(doc(this.firestore, collection, document), callback);
        this.snapshots.push(snap);
    }

    public subscribeToGameStart(callback: (gameStart: string) => void) {
        const snap = onSnapshot(doc(this.firestore, 'setupItems', 'startTime'), (doc: DocumentSnapshot) => {
            if (doc.exists()) {
                callback(doc.data().start)
            }
        });
        this.snapshots.push(snap);
    }

    private subscribeToCollection(collectionName: string, callback: (snapshot: QuerySnapshot) => void, filter: any = null) {
        const collectionRef = collection(this.firestore, collectionName);
        const q = query(collectionRef, filter);
        const unsubscribe = onSnapshot(q, callback);
        this.snapshots.push(unsubscribe);
    }

    public subscribeToTeamsData(callback: (snapshot: QuerySnapshot) => void) {
        this.subscribeToCollection("teams", callback)
    }

    public subscribeToTeamsBoatData(teamId: string, callback: (snapshot: QuerySnapshot) => void) {
        this.subscribeToCollection("boats", callback, where("teamId", "==", teamId))
    }
    
    public subscribeToAreaBoatData(areaNumber: number, callback: (snapshot: QuerySnapshot) => void) {
        this.subscribeToCollection("boats", callback, where("destination", "==", areaNumber))
    }

    public subscribeToAllBoatData(callback: (snapshot: QuerySnapshot) => void) {
        this.subscribeToCollection("boats", callback)
    }


    public dropConnections(): void {
        this.snapshots.forEach(snapshot => {
            snapshot();
        });
    }
}
