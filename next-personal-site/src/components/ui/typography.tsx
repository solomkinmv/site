import React from "react";
import Link from "next/link";
import {ChevronRight} from "lucide-react";
import {imageSize, imagesInRow} from '@/lib/images';
import {BlogImage} from '@/components/blog/BlogImage';
import {cn} from '@/lib/utils';

export function TypographyH1({children, ...props}: React.ComponentPropsWithoutRef<'h1'>) {
    return (
        <h1 className="scroll-m-24 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl" {...props}>
            {children}
        </h1>
    )
}

export function TypographyH2({children, ...props}: React.ComponentPropsWithoutRef<'h2'>) {
    return (
        <h2 className="mt-12 scroll-m-24 font-display text-3xl font-medium tracking-tight first:mt-0" {...props}>
            {children}
        </h2>
    )
}

export function TypographyH3({children, ...props}: React.ComponentPropsWithoutRef<'h3'>) {
    return (
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight" {...props}>
            {children}
        </h3>
    )
}

export function TypographyH4({children, ...props}: React.ComponentPropsWithoutRef<'h4'>) {
    return (
        <h4 className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight" {...props}>
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

export function TypographyOrderedList(props: React.ComponentPropsWithoutRef<'ol'>) {
    const {children, ...rest} = props;
    return (
        <ol className="mt-4 mb-6 ml-6 list-decimal list-outside [&>li]:mt-2" {...rest}>
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

export function TypographyTableCell({children, ...props}: React.ComponentPropsWithoutRef<'td'>) {
    return (
        <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right" {...props}>
            {children}
        </td>
    )
}

export function TypographyTableHeaderCell({children, ...props}: React.ComponentPropsWithoutRef<'th'>) {
    return (
        <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right" {...props}>
            {children}
        </th>
    )
}

export async function TypographyImage(props: {alt?: string; src?: string; title?: string; className?: string}) {
    const {src, title, className} = props;
    if (!src) return null;
    const zoomable = !props.alt?.endsWith('|no-zoom');
    const alt = zoomable ? props.alt ?? '' : props.alt!.slice(0, -'|no-zoom'.length).trim();
    const caption = title || alt;
    const {width, height} = await imageSize(src);
    return (
        <figure className={cn("not-prose my-10 min-w-0 lg:-mx-24", className)}>
            <BlogImage src={src} alt={alt} width={width} height={height} zoomable={zoomable} />
            {caption && <figcaption className="mt-3 text-center text-sm text-muted-foreground">{caption}</figcaption>}
        </figure>
    );
}

export function ImageRow({children}: {children: React.ReactNode}) {
    const images = imagesInRow(children);
    if (images.length === 0) return <>{children}</>;
    return (
        <div data-slot="image-row" className="not-prose my-10 flex flex-col gap-6 sm:flex-row lg:-mx-24">
            {images.map((image, index) => <TypographyImage key={`${image.src}-${index}`} {...image} className="my-0 flex-1 lg:mx-0" />)}
        </div>
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
            className="font-medium text-highlight underline underline-offset-4 hover:text-foreground"
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
