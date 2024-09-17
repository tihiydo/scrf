import { makeAutoObservable } from "mobx";
import { Resettable } from "..";


const DEFAULT_VOLUME = 80;

export class VolumeControlStore implements Resettable {
    value: number;
    lastValue: Maybe<number>;
    muted: boolean;

    constructor() {
        this.value = DEFAULT_VOLUME;
        this.muted = false;
        this.lastValue = null

        makeAutoObservable(this)
    }



    changeVolume(incrementor: number) {
        let newVolume = this.value + incrementor;
        newVolume = this._validateVolume(newVolume);

        this.value = newVolume;

        return newVolume;
    }

    setVolume(value: number) {
        let newVolume = this._validateVolume(value);

        this.value = newVolume;
        return newVolume
    }

    toggleMute() {
        this.muted = !this.muted;

        if (this.muted) {
            this.lastValue = this.value;
            this.value = 0;
        } else {
            this.value = this.lastValue ?? 10;
            this.lastValue = 0;
        }
    }


    reset() {
        this.value = DEFAULT_VOLUME;
        this.muted = false;
        this.lastValue = null
    }

    private _validateVolume(volume: number) {
        let validVolume = volume;

        if (validVolume > 100) validVolume = 100
        if (validVolume < 0) validVolume = 0

        if (validVolume === 0) {
            this.muted = true;
        } else {
            this.muted = false;
        }

        return validVolume
    }

}