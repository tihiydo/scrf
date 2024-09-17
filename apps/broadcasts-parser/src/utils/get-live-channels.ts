import { sleep } from "./index.js";
import { ChannelsLive, CustomChannels } from "../entities/channels.js";
import DatabaseManager from "./database.js";
import { request } from "./request.js";

export const getLiveChannels = async (dbClass: DatabaseManager) =>
{   
    while(true)
    {
        const response = await request({method: "tv/channels"}) as ChannelsLive | false
        if(response)
        {
            const channels : CustomChannels[] = []
            response.data.map((el) =>
            {
                if(el.name == "Sport")
                {
                    el.channels.map((el) =>
                    {
                        const id = el.id
                        const name = el.name
                        const url = el.url

                        channels.push({id, channelName: name, channelLink: url})
                    })
                }
            })

            await dbClass.addChannels(channels)
        }
        await sleep(86400)
    }
}