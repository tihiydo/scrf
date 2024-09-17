import { Resettable } from "@/modules/video-player/shared/stores";
import { makeAutoObservable } from "mobx";


export class MoviePlayerStore implements Resettable {
    title: string;
    src: string;
    imdbid: string;

    constructor(title: string, src: string, imdbid: string) {
        this.title = title;
        this.src = src;
        this.imdbid = imdbid;

        makeAutoObservable(this);
    }

    init(data: { title: string, src: string, imdbid: string }) {
        this.title = data.title;
        this.src = data.src;
        this.imdbid = data.imdbid
    }


    reset() {
        this.title = 'Video';
        this.src = '';
        this.imdbid = '';
    }
}