import {ReactElement} from "react";

export type Meta = {
    id: string;
    title: string;
    date: string;
    tags: string[];
    draft: boolean;
    summary?: string;
    description?: string;
    image?: string;
}

export type BlogPost = {
    meta: Meta;
    content: ReactElement;
}
