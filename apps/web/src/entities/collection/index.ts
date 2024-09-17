import { Fiction } from "@/entities/fiction";

export type Collection = {
    id: string;
    slug: string;
    name: string;
    description?: string;
    collectionFictions: CollectionFiction[];
}

export type CollectionFiction = {
    id: string;
    position: number;
    collection?: Collection;
    fiction?: Fiction;
}
