import { config } from "dotenv";
import DatabaseManager from "./utils/database.js";
import { getLiveMatches } from "./utils/get-live-events.js";
import { getLiveChannels } from "./utils/get-live-channels.js";
import { removeOldEvents } from "./utils/remove-old-events.js";
import { paresAllEvents } from "./utils/parse-all-events.js";

(async () => {
    config();
    const dbClass = new DatabaseManager()
    const promises = [paresAllEvents(dbClass), removeOldEvents(dbClass), getLiveMatches(dbClass), getLiveChannels(dbClass)];
    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => 
    {
        if (result.status === 'fulfilled') 
        {
            console.log(`Promise ${index} fulfilled with value: `, result.value);
        } 
        else 
        {
            console.error(`Promise ${index} rejected with reason:`, result.reason);
        }
    });
    await dbClass.closeConnection()
}
)();