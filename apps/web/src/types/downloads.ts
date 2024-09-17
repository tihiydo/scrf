import dayjs from 'dayjs';
export type DownloadData = {
    imdbid: string;
    title: string;
    downloadStartAt: string;
    downloadFileSize: string;
    downloadedFileSize: string;
    downloadFinishedAt: string | null;
    fragmentationProcess: boolean;
    downloadIsComplete: boolean;
    fragmentationIsComplete: boolean;
    fragmentationStartedAt:  string | null
    fragmentationFinishedAt: string | null;
    fragmentationError: string | null;
    isDeclined: boolean;
};

export type MoviesData = {
    imdbid: string;
    title: string;
    slug: string;
    portraitImage: string;
    description: string;
    fullDescription: string;
    voteCount: number;
    rating: number;
    runtime: number;
    releaseDate: Date | dayjs.Dayjs;
    addedAt: Date | dayjs.Dayjs;
    checked: boolean
    genres:
    {
        genreName: string
        id: string
    }[]
    studios:
    {
        imdbid: string
        studioName: string
    }[]
};

export type personality = 
{
    imdbid: string
    personName: string
}[]

export type genres =
{
    genreName: string
    id: string
}[]

export type studios =
{
    imdbid: string
    studioName: string
}[]

export type MoviesDataTable = {

}

export type DownloadDataTable = {
    imdbid: string;
    title: string;
    status: string,
    fileSize: string,
    downloadStartAt: string;
    downloaded: string
    downloadFinishedAt: string;
    fragmentationFinishedAt: string;
    fragmentationError: string | null;
}


export const Resolutions = [360, 480, 720, 1080]