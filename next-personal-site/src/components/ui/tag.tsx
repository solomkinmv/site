export function Tag({text}: {text: string}) {
    return (
        <span className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
            #{text}
        </span>
    )
}
