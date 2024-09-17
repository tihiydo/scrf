import { makeAutoObservable } from "mobx";
import { Resettable } from "..";

type PlayerMetadataState = 'loaded' | 'loading' | 'parsed' | 'idle' | 'error'

export class MediaInfoStore implements Resettable {
    manifestState: PlayerMetadataState;

    constructor() {
        this.manifestState = 'idle'

        makeAutoObservable(this);
    }

    setManifestState(state: PlayerMetadataState) {
        this.manifestState = state
    }

    reset() {
        this.manifestState = 'idle';
    }
}