import React from "react";
import Link from "next/link";

export function TypographyH1({children}: any) {
    return (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {children}
        </h1>
    )
}

export function TypographyH2({children}: any) {
    return (
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {children}
        </h2>
    )
}

export function TypographyH3({children}: any) {
    return (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {children}
        </h3>
    )
}

export function TypographyH4({children}: any) {
    return (
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {children}
        </h4>
    )
}

export function TypographyP({children}: any) {
    return (
        <p className="leading-7 [&:not(:first-child)]:mt-6">
            {children}
        </p>
    )
}

export function TypographyBlockquote({children}: any) {
    return (
        <blockquote className="mt-6 border-l-2 pl-6 italic">
            {children}
        </blockquote>
    )
}

export function TypographyList(props: any) {
    console.log("list", props);
    return (
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            {props.children}
        </ul>
    )
}

export function TypographyListItem({children}: any) {
    return (
        <li>
            {children}
        </li>
    )
}


export function TypographyLink(props: any) {
    console.log("link", props);
    return <Link href={props.href} className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">{props.children}</Link>
}
