import Image from "next/image"
import {imageSize} from '@/lib/images';

type Props = {
    src: string,
    alt: string,
    priority?: string | boolean,
}

export default async function CustomImage({ src, alt, priority }: Props) {
    const {width, height} = await imageSize(src);

    return (

        <div className="w-full h-full">
            <Image
                className="h-auto max-w-full rounded-lg mx-auto"
                src={src}
                alt={alt}
                width={width}
                height={height}
                preload={priority === true || priority === 'true'}
            />
        </div>
    )
}
