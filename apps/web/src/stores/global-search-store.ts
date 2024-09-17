import { makeAutoObservable } from "mobx";


class GlobalSearchStore {
    opened: boolean;
    searchStr: string;

    constructor() {
        this.opened = false;
        this.searchStr = ''

        makeAutoObservable(this);
    }

    toggleOpen(opened?: boolean) {
        const nextState = typeof opened === 'boolean' ? opened : !this.opened;

        this.opened = nextState
        this.searchStr = '';
    }

    setSearchStr(searchStr: string) {
        this.searchStr = searchStr
    }
}

export const globalSearchStore = new GlobalSearchStore();