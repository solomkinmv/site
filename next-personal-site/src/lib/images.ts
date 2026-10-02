import path from 'node:path';
import {cache} from 'react';
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
