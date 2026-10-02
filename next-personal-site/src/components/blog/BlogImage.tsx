"use client";

import Image from "next/image";
import {Dialog} from "radix-ui";
import {Maximize2, X} from "lucide-react";
import {Button} from "@/components/ui/button";

type Props = {
    src: string;
    alt: string;
    width: number;
    height: number;
    zoomable?: boolean;
    preload?: boolean;
};

export function BlogImage({src, alt, width, height, zoomable = true, preload = false}: Props) {
    const image = <Image src={src} alt={alt} width={width} height={height} preload={preload}
        className="my-0 h-auto w-full rounded-lg" />;
    const className = `mx-auto block w-full rounded-lg ${height > width ? "max-w-sm" : ""}`;

    if (!zoomable) return <div className={className}>{image}</div>;

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button type="button" aria-label={`Enlarge ${alt || "image"}`} className={`${className} group relative cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring`}>
                    {image}
                    <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full border bg-background/90 text-foreground shadow-sm transition-colors group-hover:bg-background" aria-hidden="true">
                        <Maximize2 className="size-4" />
                    </span>
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-1rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-2 pt-14 shadow-xl sm:p-6 sm:pt-16">
                    <Dialog.Title className="sr-only">{alt || "Image preview"}</Dialog.Title>
                    <Dialog.Description className="sr-only">Enlarged image. Press Escape or use the close button to return to the article.</Dialog.Description>
                    <Image src={src} alt={alt} width={width} height={height}
                        className="mx-auto max-h-[calc(90dvh-5rem)] w-full object-contain" />
                    <Dialog.Close asChild>
                        <Button variant="ghost" size="icon" className="absolute right-2 top-2 size-11 rounded-full" aria-label="Close image preview">
                            <X aria-hidden="true" />
                        </Button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
