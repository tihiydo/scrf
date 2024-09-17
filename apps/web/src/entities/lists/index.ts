import { MinimalMovie } from "../movie";
import { MinimalSerial } from "../serial";

export type List = {
    id: string;
    name: string;
    slug: string;
    movies?: MinimalMovie[]
    serials?: MinimalSerial[]
}
