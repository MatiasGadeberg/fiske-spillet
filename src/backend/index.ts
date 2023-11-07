import { FirebaseWrapper } from "../shared/classes/FirebaseWrapper.js";
import { FishGame } from "./src/classes/FishGame.js";
import { QuerySnapshot } from "firebase/firestore";

const firebase = new FirebaseWrapper();

const game = new FishGame({
    startTime: Date.now() + 2 * 60 * 1000,
});

firebase.setGame(game.getGameData());

firebase.subscribeToTeamData((snapshot: QuerySnapshot) => {
    snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
            game.addTeam();
        }
        if (change.type === "modified") {
            if (change.doc.data().currentActivePlayers === 0) {
                game.removeTeam();
            }
        }
    });
});

setInterval(() => {
    const gamedata = game.getGameData();

    if (gamedata.gameState === "ended") {
        firebase.dropConnections();
    } else {
        firebase.setGame(game.getGameData());
    }
}, 250);
