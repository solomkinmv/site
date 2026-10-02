import Link from 'next/link';
import type {Metadata} from 'next';

export const metadata: Metadata = {
    title: 'Page Not Found',
    robots: {index: false, follow: true},
    alternates: {canonical: null},
};

export default function NotFound() {
    return (
        <main id="main-content" tabIndex={-1} className="flex-1 p-6 md:p-10 text-center">
            <h1 className="text-3xl font-bold">Page not found</h1>
            <p className="mt-4">Sorry, the requested page does not exist.</p>
            <Link href="/" className="mt-4 inline-block underline">Back to Home</Link>
        </main>
    );
}
