import Link from "next/link"
import Image from "next/image"
import getFormattedDate from "@/lib/getFormattedDate"
import {Meta} from "@/lib/types";
import {Card} from "@/components/ui/card";

type Props = {
    post: Meta
}

export default function ListItem({post}: Props) {
    const {id, title, date, summary, image} = post
    const formattedDate = getFormattedDate(date)

    return (
        <li className="list-none">
            <Card className="p-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold tracking-tight">
                            <Link href={`/posts/${id}`} className="hover:underline">
                                {title}
                            </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground">{formattedDate}</p>
                        {summary && (
                            <p className="text-sm mt-2">{summary}</p>
                        )}
                    </div>
                    {image && (
                        <Image
                            src={image}
                            alt={title}
                            width={160}
                            height={160}
                            className="object-cover rounded-md flex-shrink-0"
                        />
                    )}
                </div>
            </Card>
        </li>
    )
}
