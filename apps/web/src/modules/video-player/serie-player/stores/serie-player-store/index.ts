import { Resettable } from "@/modules/video-player/shared/stores";
import { makeAutoObservable } from "mobx";


export class SeriePlayerStore implements Resettable {
    title: string;
    src: string;
    serialImdbid: string;
    episodeImdbid: string;

    constructor(title: string, src: string, serialImdbid: string, episodeImdbid: string) {
        this.title = title;
        this.src = src;
        this.serialImdbid = serialImdbid;
        this.episodeImdbid = episodeImdbid

        makeAutoObservable(this);
    }

    init(data: { title: string, src: string, serialImdbid: string, episodeImdbid: string }) {
        this.title = data.title;
        this.src = data.src;
        this.serialImdbid = data.serialImdbid
        this.episodeImdbid = data.episodeImdbid;
    }


    reset() {
        this.title = 'Video';
        this.src = '';
        this.serialImdbid = '';
        this.episodeImdbid = '';
    }
}