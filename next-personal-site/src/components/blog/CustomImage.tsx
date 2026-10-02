import {BlogImage} from "@/components/blog/BlogImage";
import {imageSize} from '@/lib/images';

type Props = {
    src: string,
    alt: string,
    priority?: string | boolean,
}

export default async function CustomImage({ src, alt, priority }: Props) {
    const {width, height} = await imageSize(src);

    return <BlogImage src={src} alt={alt} width={width} height={height} preload={priority === true || priority === 'true'} />;
}
