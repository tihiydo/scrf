import { DownloadData } from "@/types/downloads"

export const getStatus = (el: DownloadData) =>
{
    if(el.fragmentationError)
    {
        return "BROKEN, SKIP"
    }
    if(el.isDeclined)
    {
        return "DECLINED"
    }
    if(el.downloadIsComplete)
    {
        if(el.fragmentationIsComplete)
        {
            return "Converted"
        }
        else if(el.fragmentationProcess)
        {
            return "Fragmentations"
        }
        return "Downloaded"
    }
    else if(!el.downloadIsComplete)
    {
        return "Downloading"
    }
    return "Unknown"
}