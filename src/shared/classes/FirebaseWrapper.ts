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
    getDocs,
    writeBatch,
} from "firebase/firestore";
import type { 
    BoatAndAreaInfo, 
    BoatInfo, 
    Boats,
    EventData,
    EventType,
    FeatureFlags,
    FishMarket,
    GameInfo,
    NumberOfTeams,
    TeamInfo 
} from "../types/GameTypes";

export class FirebaseWrapper {
    private app: FirebaseApp;
    private firestore: Firestore;
    private snapshots: Unsubscribe[];
    private batch: writeBatch;
    private batchCount = 0;

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
        this.batch = writeBatch(this.firestore);

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

    public async updateTeamsData(teamsData: {
        teamId: string;
        eventIds?: string[];
        teamData: Partial<TeamInfo>
    }[]) {
        let batch = writeBatch(this.firestore);
        let count = 0;
        while (teamsData.length) {
            let team = teamsData.shift();
            if (team?.eventIds && count + team.eventIds.length + 1 >= 500) {
                await batch.commit();
                batch = writeBatch(this.firestore);
                count = 0;
            }
            if (team) {
                const teamRef = doc(this.firestore, "teams", team.teamId);
                batch.update(teamRef, team.teamData);
                count++;
                if (team.eventIds) {
                    team.eventIds.forEach((event) => {
                        const eventRef = doc(this.firestore, "events", event);
                        batch.update(eventRef, { isProcessed: true });
                        count++;
                    })
                }
            }
            if (!teamsData.length) {
                await batch.commit();
                batch = writeBatch(this.firestore);
                count = 0;
            }
        }
    }

    public async getTeamData(teamId: string) {
        const document = await getDoc(doc(this.firestore, "teams", teamId));
        return document.data() as TeamInfo;
    }

    public async getTeamsData() {
        const querySnapshot = await getDocs(query(collection(this.firestore, "teams")));
        return querySnapshot.docs.map((doc) => doc.data());
    }

    public async getTeamBoatsData(teamId: string) {
        const querySnapshot = await getDocs(query(collection(this.firestore, "boats"), where("teamId", "==", teamId)));
        return querySnapshot;
    }

    public async sendEvent<T extends EventType>(eventData: Omit<EventData<T>, 'isProcessed' | 'eventId'>) {
        return addDoc(collection(this.firestore, "events"), {...eventData, isProcessed: false});
    }

    public async sendBatchedEvent<T extends EventType>(eventData: Omit<EventData<T>, 'isProcessed' | 'eventId'>) {

        const docRef = doc(collection(this.firestore, "events"))
        this.batch.set(docRef, {...eventData, isProcessed: false})
        if (this.batchCount++ >= 50) {
            this.batch.commit()
            this.batchCount = 0;
            this.batch = writeBatch(this.firestore);
        }
    }

    public async sendEvents<T extends EventType>(eventData: Omit<EventData<T>, 'isProcessed' | 'eventId'>) {
        return addDoc(collection(this.firestore, "events"), {...eventData, isProcessed: false});
    }

    public async setEventsProcessed(eventIds: string[]) {
        let batch = writeBatch(this.firestore)
        let count = 0;
        while (eventIds.length) {

            const eventId = eventIds.shift();
            if (eventId) batch.update(doc(this.firestore, "events", eventId), {isProcessed: true});

            if (count++ >= 500 || !eventIds.length) {
                await batch.commit();
                batch = writeBatch(this.firestore);
                count = 0;
            }
        }
    }
    
    public async setEventProcessed(eventId: string) {
        await updateDoc(doc(this.firestore, "events",eventId), {isProcessed: true});
    }

    public async createBoat(data: {
        type: Boats;
        teamId: string;
        speed: number;
        cargoSize: number;
        name: string;
        availableFish: string[];
    }) {
        const boatData: Omit<BoatInfo, 'boatId'> = {
            teamId: data.teamId,
            type: data.type,
            speed: data.speed,
            name: data.name,
            inUse: false,
            cargoSize: data.cargoSize,
            availableFish: data.availableFish,
            startTime: null,
            endTime: null,
            catchTime: null,
            destination: null,
            status: 'docked',
            cargo: []
        }

        return await addDoc(collection(this.firestore, "boats"), boatData)
    }

    public async getDockedBoatsData() {
        const querySnapshot = await getDocs(query(
            collection(this.firestore, "boats"), 
            where("status", "==", 'docked'),
        ));
        return querySnapshot;
    }

    public async updateBoatData(boatId: string, boatData: Partial<BoatInfo>) {
        const boatRef = doc(this.firestore, "boats", boatId);
        await updateDoc(boatRef, boatData);
    }

    public async updateBoatsData(boatsData: {boatId: string; eventId?: string; boatData: Partial<BoatInfo>}[]) {
        let batch = writeBatch(this.firestore);
        let count = 0;
        while (boatsData.length) {
            let boat = boatsData.shift();
            if (boat) {
                const boatRef = doc(this.firestore, "boats", boat.boatId);
                batch.update(boatRef, boat.boatData);
                count++;
                if (boat.eventId) {
                    const eventRef = doc(this.firestore, "events", boat.eventId);
                    batch.update(eventRef, { isProcessed: true });
                    count++;
                }
            }
            if (count >= 500 || !boatsData.length) {
                await batch.commit();
                batch = writeBatch(this.firestore);
                count = 0;
            }
        }

    }

    public subscribeToEvents<T extends EventType>(callback: (events: EventData<T>[]) => void, eventType: string = '') {
        const eventsRef = collection(this.firestore, "events");
        const q = query(eventsRef, where('type', '==', eventType), where('isProcessed', '==', false));
        const unsubscribe = onSnapshot(q, snapshot => {
            const events = snapshot.docChanges().reduce<EventData<T>[]>((eventArr, change) => {
                if (change.type === "added") {
                    const data: EventData<T> = {
                        ...change.doc.data() as EventData<T>,
                        eventId: change.doc.id
                    }
                    eventArr.push(data);
                }
                return eventArr;
            }, []);

            callback(events);
        });
        this.snapshots.push(unsubscribe);
    }

    public subscribeToFishSellEvents(callback: (events: EventData<'sell'>[]) => void) {
        this.subscribeToEvents<'sell'>(callback, 'sell')
    }

    public subscribeToBoatBuyEvents(callback: (events: EventData<'buy'>[]) => void) {
        this.subscribeToEvents<'buy'>(callback, 'buy')
    }

    public subscribeToBoatSailEvents(callback: (events: EventData<'sail'>[]) => void) {
        this.subscribeToEvents<'sail'>(callback, 'sail')
    }

    public subscribeToLoginEvents(callback: (events: EventData<'login'>[]) => void) {
        this.subscribeToEvents<'login'>(callback, 'login')
    }

    public subscribeToLogoutEvents(callback: (events: EventData<'logout'>[]) => void) {
        this.subscribeToEvents<'logout'>(callback, 'logout')
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

    public subscribeToFeatureFlags(callback: (featureFlags: FeatureFlags) => void) {
        const snap = onSnapshot(doc(this.firestore, 'setupItems', 'featureFlags'), (doc: DocumentSnapshot) => {
            if (doc.exists()) {
                callback(doc.data() as FeatureFlags)
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

    public async queryCatchBoats(callback: (boats: BoatInfo[]) => void) {
        const boatsRef = collection(this.firestore, 'boats')
        const q = query(boatsRef, where("catchTime", "<=", Date.now()), where("status", "==", "outbound"));
        const snapshot = await getDocs(q);
        const boats = this.getBoatsFromSnapshot(snapshot)
        callback(boats)
    }

    public async queryArrivedBoats(callback: (boats: BoatInfo[]) => void) {
        const boatsRef = collection(this.firestore, 'boats')
        const q = query(boatsRef, where("endTime", "<=", Date.now()), where("status", "==", "inbound"));
        const snapshot = await getDocs(q);
        const boats = this.getBoatsFromSnapshot(snapshot)
        callback(boats)
    }

    private getBoatsFromSnapshot(snapshot: QuerySnapshot) {
        return snapshot.docs.map(doc => {
            const data = doc.data() as BoatInfo;
            data.boatId = doc.id
            return data
        })
    }

    public dropConnections(): void {
        this.snapshots.forEach(snapshot => {
            snapshot();
        });
    }
}
