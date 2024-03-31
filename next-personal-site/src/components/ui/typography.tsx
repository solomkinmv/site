import React, {AnchorHTMLAttributes, DetailedHTMLProps, HTMLAttributes, ImgHTMLAttributes} from "react";
import Link from "next/link";
import {MDXComponents, MDXContent, MDXProps} from "mdx/types";

export function TypographyH1({children}: any) {
    return (
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            {children}
        </h1>
    )
}

export function TypographyH2({children}: any) {
    return (
        <h2 className="border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {children}
        </h2>
    )
}

export function TypographyH3({children}: any) {
    return (
        <h3 className="text-2xl font-semibold tracking-tight">
            {children}
        </h3>
    )
}

export function TypographyH4({children}: any) {
    return (
        <h4 className="text-xl font-semibold tracking-tight">
            {children}
        </h4>
    )
}

export function TypographyP({children}: any | undefined) {
    /*
    In HTML, the <figure> element is a block-level element and it's not allowed to be a child of the <p> element,
    which is a paragraph-level element.  When a block-level element is encountered in the content of a <p> element,
    the parser implicitly closes the <p> element before starting the block-level element. This is why your <figure>
    element appears to be outside of the <p> element.
     */
    if (children.type === TypographyImage) {
        return children;
    }
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

export function TypographyImage(props: any | undefined) {
    const {alt, src} = props;
    return (
        <figure className="lg:-mx-12 xl:-mx-20">
            <img
                alt={alt}
                className="overflow-hidden rounded-lg object-cover"
                src={src}
                style={{objectFit: 'contain'}}
            />
            {alt && <figcaption className="text-center">{alt}</figcaption>}
        </figure>
    );
}


export function TypographyLink(props: any | undefined) {
    if (!props?.href) {
        return null;
    }
    if (props.href.startsWith("#")) {
        return <Link href={props.href}>{props.children}</Link>
    }
    return <Link href={props.href}>{props.children}</Link>
}
