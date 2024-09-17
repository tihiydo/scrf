import { getTwoDays, sleep } from "./index.js"
import DatabaseManager from "./database.js"
import { request } from "./request.js"
import { SomeEvent } from "../entities2/football.js"

export const paresAllEvents = async (dbClass: DatabaseManager) =>
{
    const data = await dbClass.getAllSportsId()
    try
    {
        while(true)
        {
            for(const el of data)
            {
                const allMatches = [];
                const [firstDay, secondDay] = await getTwoDays()
                console.log(`Parse sports with id - ${el.id}`)
                const requests = [(await request({method: "fixtures", query: {sport_id: el.id, date: firstDay}}) as SomeEvent | false), (await request({method: "fixtures", query: {sport_id: el.id, date: secondDay}}) as SomeEvent | false)]

                for(const request of requests)
                {
                    try
                    {
                        if(request)
                        {
                            await Promise.allSettled(request.data.map( async (e) =>
                            {
                                const hasFieldEventName =  e?.localteam?.name !== undefined &&  e?.localteam?.name !== null;
                                const hasFieldTeam = e?.name !== undefined && e?.name !== null;

                                const data = 
                                {
                                    matchId: e?.id,
                                    firstName: e?.localteam?.name || null,
                                    firstLogo: e.localteam?.logo || null,
                                    secondName: e?.visitorteam?.name || null,
                                    secondLogo: e?.visitorteam?.logo || null,
                                    startAt: e?.start_at,
                                    sportId: e?.sport_id,
                                    leagueId: e?.league?.id || null,
                                    leagueName: e?.league?.name || null,
                                    name: e?.name || null
                                }

                                if (hasFieldTeam || hasFieldEventName) 
                                {
                                    allMatches.push(data);
                                }

                            }))
                            console.log(allMatches)
                            await dbClass.addEvents(allMatches);
                            console.log("ADDED")
                        }
                        await sleep(30)
                    }
                    catch(err)
                    {
                        console.log(err)
                    }
                }
            }
        }
    }
    catch(e: any)
    {
        console.log(e)
    }
}