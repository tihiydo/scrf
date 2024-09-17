import { StaticImageData } from "next/image";

export type Fiction = {
    title: string;
    description: string;
    rating: string;
    age: number;
    releaseDate: string;
    producedBy: string;
    runtime: number;
    image: string | StaticImageData;
}