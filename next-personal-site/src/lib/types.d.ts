import {JSXElementConstructor, ReactElement} from "react";

type Meta = {
    id: string,
    title: string,
    date: string,
    tags: string[],
    draft: boolean,
    summary?: string,
    description?: string,
    image?: string,
}

type BlogPost = {
    meta: Meta,
    content: ReactElement<any, string | JSXElementConstructor<any>>,
}
