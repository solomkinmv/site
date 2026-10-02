import Link from "next/link"
import Image from "next/image"
import getFormattedDate from "@/lib/getFormattedDate"
import {Meta} from "@/lib/types";
import {ArrowUpRight} from "lucide-react";

type Props = {
    post: Meta
}

export default function ListItem({post}: Props) {
    const {id, title, date, summary, image, cardImage, cardImagePosition} = post
    const thumbnail = cardImage ?? image
    const formattedDate = getFormattedDate(date)

    return (
        <li className="group list-none py-7">
            <Link href={`/posts/${id}`} className="flex items-start gap-4 sm:gap-6">
                <div className="flex-1 min-w-0">
                    <time dateTime={date} className="text-xs text-muted-foreground">{formattedDate}</time>
                    <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-highlight sm:text-xl">
                        {title}
                    </h3>
                    {summary && (
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{summary}</p>
                    )}
                </div>
                {thumbnail && (
                    <Image
                        src={thumbnail}
                        alt=""
                        width={192}
                        height={144}
                        className={`mt-1 h-18 w-24 shrink-0 rounded-lg border bg-muted sm:h-36 sm:w-48 ${cardImage ? "object-cover" : "object-contain"}`}
                        style={cardImagePosition ? {objectPosition: cardImagePosition} : undefined}
                    />
                )}
                <ArrowUpRight className="mt-2 hidden size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground sm:block" aria-hidden="true" />
            </Link>
        </li>
    )
}
