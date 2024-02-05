import Link from "next/link"

export default function NotFound() {
    return (
        <div className="text-center">
            <p className="mt-10">Sorry, the requested post does not exist.</p>
            <Link href="/next-personal-site/public">Back to Home</Link>
        </div>
    )
}
