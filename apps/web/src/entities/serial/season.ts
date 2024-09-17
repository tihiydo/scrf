import { Serial } from ".";
import { Episode } from "./episode";

export type Season = {
    id: string;
    position: number;
    episodesCount: number;
    serial?: Serial;
    episodes?: Episode[]
}