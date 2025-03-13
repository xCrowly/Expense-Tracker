import { initializeApp } from "firebase/app";
import { getDatabase, push, ref } from "firebase/database";

const appSettings = {
    databaseUrl: "https://expanse-tracker-e6806-default-rtdb.europe-west1.firebasedatabase.app/"
}

const appDatabase = initializeApp(appSettings);
const database = getDatabase(appDatabase);
const getUserInfo = ref(database, "getUserInfo");

for (let index = 0; index < 2; index++) {
    push(getUserInfo, "hi")
}

export const app2 = initializeApp(appSettings)



