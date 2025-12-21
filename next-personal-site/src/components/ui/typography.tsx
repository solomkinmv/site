import React from "react";
import Link from "next/link";
import {ChevronRight} from "lucide-react";

export function TypographyH1({children}: {children: React.ReactNode}) {
    return (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {children}
        </h1>
    )
}

export function TypographyH2({children}: {children: React.ReactNode}) {
    return (
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {children}
        </h2>
    )
}

export function TypographyH3({children}: {children: React.ReactNode}) {
    return (
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            {children}
        </h3>
    )
}

export function TypographyH4({children}: {children: React.ReactNode}) {
    return (
        <h4 className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight">
            {children}
        </h4>
    )
}

export function TypographyP({children}: {children: React.ReactNode}) {
    if (children && typeof children === 'object' && 'type' in children && children.type === TypographyImage) {
        return children;
    }
    return (
         <p className="leading-7 not-first:mt-6">
            {children}
        </p>
    )
}

export function TypographyBlockquote({children}: {children: React.ReactNode}) {
    return (
        <blockquote className="mt-6 border-l-2 pl-6 italic">
            {children}
        </blockquote>
    )
}

export function TypographyList({children}: {children: React.ReactNode}) {
    return (
        <ul className="mt-4 mb-6 ml-6 list-disc [&>li]:mt-2">
            {children}
        </ul>
    )
}

export function TypographyOrderedList({children}: {children: React.ReactNode}) {
    return (
        <ol className="mt-4 mb-6 ml-6 list-decimal list-outside [&>li]:mt-2">
            {children}
        </ol>
    )
}

export function TypographyListItem({children}: {children: React.ReactNode}) {
    return (
        <li className="list-item">
            {children}
        </li>
    )
}

export function TypographyInlineCode(props: React.HTMLAttributes<HTMLElement> & {children?: React.ReactNode}) {
    const {children, ...rest} = props;
    // Skip styling for code blocks (they have data-language attribute from rehype-pretty-code)
    if ('data-language' in rest || 'data-theme' in rest) {
        return <code {...rest}>{children}</code>;
    }
    return (
        <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            {children}
        </code>
    )
}

export function TypographyLead({children}: {children: React.ReactNode}) {
    return (
        <p className="text-muted-foreground text-xl">
            {children}
        </p>
    )
}

export function TypographyLarge({children}: {children: React.ReactNode}) {
    return (
        <div className="text-lg font-semibold">
            {children}
        </div>
    )
}

export function TypographySmall({children}: {children: React.ReactNode}) {
    return (
        <small className="text-sm leading-none font-medium">
            {children}
        </small>
    )
}

export function TypographyMuted({children}: {children: React.ReactNode}) {
    return (
        <p className="text-muted-foreground text-sm">
            {children}
        </p>
    )
}

export function TypographyTable({children}: {children: React.ReactNode}) {
    return (
        <div className="my-6 w-full overflow-y-auto">
            <table className="w-full">
                {children}
            </table>
        </div>
    )
}

export function TypographyTableHead({children}: {children: React.ReactNode}) {
    return (
        <thead className="border-b">
            {children}
        </thead>
    )
}

export function TypographyTableBody({children}: {children: React.ReactNode}) {
    return (
        <tbody>
            {children}
        </tbody>
    )
}

export function TypographyTableRow({children}: {children: React.ReactNode}) {
    return (
        <tr className="m-0 border-t p-0 even:bg-muted">
            {children}
        </tr>
    )
}

export function TypographyTableCell({children}: {children: React.ReactNode}) {
    return (
        <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
            {children}
        </td>
    )
}

export function TypographyTableHeaderCell({children}: {children: React.ReactNode}) {
    return (
        <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
            {children}
        </th>
    )
}

export function TypographyImage(props: {alt?: string; src?: string}) {
    const {alt, src} = props;
    return (
        <figure className="flex flex-col items-center lg:-mx-12 xl:-mx-20">
            <img
                alt={alt}
                className="overflow-hidden rounded-lg object-cover"
                src={src}
                style={{objectFit: 'contain'}}
            />
            {alt && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{alt}</figcaption>}
        </figure>
    );
}

export function TypographyLink(props: {href?: string; children?: React.ReactNode}) {
    if (!props?.href) {
        return null;
    }
    const isAnchor = props.href.startsWith("#");
    if (isAnchor) {
        return <Link href={props.href}>{props.children}</Link>
    }
    return (
        <Link
            href={props.href}
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
            {props.children}
        </Link>
    )
}

export function Collapsible({summary, children}: {summary: string; children: React.ReactNode}) {
    return (
        <details className="group my-4 rounded-lg border bg-card">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-semibold transition-colors hover:bg-accent [&::-webkit-details-marker]:hidden">
                <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                {summary}
            </summary>
            <div className="px-4 pb-4">
                {children}
            </div>
        </details>
    );
}

