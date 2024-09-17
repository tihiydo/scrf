import { Resettable } from "@/modules/video-player/shared/stores";
import { makeAutoObservable } from "mobx";


export class LiveStreamPlayerStore implements Resettable {
    isLive: boolean = false;
    src: string;
    title: string;

    constructor(title: string, src: string) {
        this.src = src
        this.title = title;

        makeAutoObservable(this);
    }

    init(data: { src: string, title: string }) {
        this.src = data.src;
        this.title = data.title
    }

    setIsLive(isLive: boolean) {
        this.isLive = isLive
    }

    reset() {
        this.isLive = false;
        this.src = '';
        this.title = ''
    }
}