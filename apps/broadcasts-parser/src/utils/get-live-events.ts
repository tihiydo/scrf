import { sleep } from "./index.js"
import { FixturesLive } from "../entities/fixtrures-live.js"
import DatabaseManager from "./database.js"
import { request } from "./request.js"

export const getLiveMatches = async (dbClass: DatabaseManager) =>
{
    while(true)
    {
        console.log("[INFO] GET LIVE EVENTS")
        const matchs = await dbClass.getCheckEvents()
        const getLiveStreams = await request({method: "fixtures/livestream-urls"}) as FixturesLive | false
        const matchsId = await Promise.all(matchs.map(async (match) => {
            if (!getLiveStreams) 
            {
                return null; // Если getLiveStreams отсутствует, возвращаем null
            }
        
            const findedStream = getLiveStreams.data.find((live) => {
                return live.id == match.matchId;
            });
        
            if (findedStream) 
            { 
                return {
                    matchId: findedStream.id,
                    urls: findedStream.urls
                };
            } else {
                await dbClass.deleteOld(match.matchId)
                return null;
            }
        }));
  

        if(matchsId.filter((item) => item !== null).length)
        {
            await dbClass.addLive(matchsId.filter((item) => item !== null))
        }

        
        await sleep(2000)
    }
}