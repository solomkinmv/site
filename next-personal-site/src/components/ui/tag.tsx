export function Tag({text}: {text: string}) {
    return (
        <span className="inline-flex min-h-9 items-center rounded-full border px-3 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-accent hover:text-foreground">
            #{text}
        </span>
    )
}
