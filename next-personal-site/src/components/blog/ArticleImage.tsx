import React from "react";
import {imageSize, imagesInRow} from '@/lib/images';
import {BlogImage} from '@/components/blog/BlogImage';
import {cn} from '@/lib/utils';

export async function TypographyImage(props: {alt?: string; src?: string; title?: string; className?: string}) {
    const {src, title, className} = props;
    if (!src) return null;
    const zoomable = !props.alt?.endsWith('|no-zoom');
    const alt = zoomable ? props.alt ?? '' : (props.alt ?? '').slice(0, -'|no-zoom'.length).trim();
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

// Images render as figures, which must not be nested in <p>.
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
