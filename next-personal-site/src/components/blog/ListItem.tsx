import Link from "next/link"
import getFormattedDate from "@/lib/getFormattedDate"
import {Meta} from "@/lib/types";

type Props = {
    post: Meta
}

export default function ListItem({post}: Props) {
    const {id, title, date} = post
    const formattedDate = getFormattedDate(date)

    return (
        <li>
            <Link className="not-prose mt-4 text-2xl dark:text-white/90" href={`/posts/${id}`}>{title}</Link>
            <br/>
            <p className="text-gray-500 dark:text-gray-400 mt-0">{formattedDate}</p>
        </li>
    )
}
