import {JSXElementConstructor, ReactElement} from "react";

type Meta = {
    id: string,
    title: string,
    date: string,
    tags: string[],
    draft: boolean,
}

type BlogPost = {
    meta: Meta,
    content: ReactElement<any, string | JSXElementConstructor<any>>,
}
