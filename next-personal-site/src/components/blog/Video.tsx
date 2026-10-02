type Props = {
    id: string
}

export default function Video({ id }: Props) {
    return (
        <div className="aspect-video">
            <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${id}`}
                title="YouTube video player"
                loading="lazy"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
        </div>
    );
}
