import { Fiction } from "@/entities/fiction";

export type Collection = {
    id: string;
    slug: string;
    name: string;
    fictions: Fiction[];
    visible: boolean;
}

export const collections: Collection[] = [
    {
        id: '1',
        slug: 'marvel',
        name: 'Marvel',
        fictions: [],
        visible: true
    },
    {
        id: '2',
        slug: 'dc',
        name: 'DC',
        fictions: [],
        visible: true
    },

    {
        id: '3',
        slug: 'theo',
        name: 'Theo',
        fictions: [],
        visible: true
    },
]