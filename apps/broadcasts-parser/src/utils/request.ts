import { objectToQueryParams } from "./index.js"

export const request = async ({method, query = {}} : {method: string, query?: object}) : Promise<false | object> =>
{
    const queryString = objectToQueryParams(query)
    const addQuery = queryString.length >= 1 ? "?" + queryString : ""
    try
    {
        const request = await fetch(`https://api.mustream.live/${method}${addQuery}`,
        {headers:
        {
            "x-may-api-key": "thvDZJgDWiwwJmQ86lFyMt8ysGajd",
            "client": "frank",
            "key": "uXuMuFG6RZqKJhwPRDmrcplFlUnGjle7"
        }})
        console.log(`[REQUEST] ${request.url}`)
        const response = await request.json()
        return response as object
    }
    catch
    {
        return false
    }
}