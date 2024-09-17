import { sleep } from "./index.js"
import DatabaseManager from "./database.js"
 
export const removeOldEvents = async (dbClass: DatabaseManager) =>
{
    while(true)
    {
        console.log("[INFO] REMOVE OLD MATCHES")
        await dbClass.deleteOldEvents()
        await sleep(3600 * 24)
    }
}