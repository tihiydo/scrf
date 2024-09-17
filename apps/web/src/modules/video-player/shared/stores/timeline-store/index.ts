import { makeAutoObservable } from "mobx";
import { Resettable } from "..";


export class TimelineControlsStore implements Resettable {
    buffered: number;
    currentTime: number;
    duration: number;

    constructor() {
        this.buffered = 0;
        this.currentTime = 0;
        this.duration = 0;

        makeAutoObservable(this)
    }


    setCurrentTime(seconds: number) {
        this.currentTime = seconds
    }

    changeCurrentTime(incrementor: number) {
        let newTime = Math.floor(this.currentTime + incrementor);

        if (newTime < 0) newTime = 0
        if (this.duration && newTime > this.duration) newTime = this.duration

        this.currentTime = newTime;
        return newTime;
    }

    setCurrentTimePercentage(percent: number) {
        let newTime = 0;

        if (!this.duration) {
            newTime = 0;
        } else {
            newTime = Math.floor(percent * this.duration / 100)
        }

        if (newTime < 0) newTime = 0
        if (this.duration && newTime > this.duration) newTime = this.duration

        this.currentTime = newTime;

        return newTime
    }

    setDuration(seconds: number) {
        this.duration = seconds
    }

    setBufferedTillSecond(second: number) {
        this.buffered = second
    }

    reset() {
        this.buffered = 0;
        this.currentTime = 0;    
        this.duration = 0;
    }
}