import path from 'node:path';
import {cache, Children, isValidElement, type ReactNode} from 'react';
import sharp from 'sharp';

export const imageSize = cache(async (src: string) => {
    const publicRoot = path.join(process.cwd(), 'public');
    const file = path.resolve(publicRoot, `.${src}`);
    if (!src.startsWith('/images/') || !file.startsWith(`${publicRoot}${path.sep}`)) {
        throw new Error(`Store article images under public/images: ${src}`);
    }
    const {width, height} = await sharp(file).metadata();
    if (!width || !height) throw new Error(`Image dimensions are missing: ${src}`);
    return {width, height};
});

type RowImage = {src: string; alt?: string; title?: string};

export function imagesInRow(children: ReactNode): RowImage[] {
    return Children.toArray(children).flatMap(child => {
        if (!isValidElement<Partial<RowImage> & {children?: ReactNode}>(child)) return [];
        const {src, alt, title, children: nested} = child.props;
        return typeof src === 'string' ? [{src, alt, title}] : imagesInRow(nested);
    });
}
