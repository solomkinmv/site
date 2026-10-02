import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import {ArrowLeft, ArrowRight, ArrowUpRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import {projects} from "@/lib/projects";

type Props = {params: Promise<{slug: string}>};

export const dynamicParams = false;

export function generateStaticParams() {
    return projects.filter(project => project.details).map(project => ({slug: project.id}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug} = await params;
    const project = projects.find(project => project.id === slug);
    if (!project?.details) notFound();

    const {title, description} = project.details;
    return {
        title,
        description,
        alternates: {canonical: project.href},
        openGraph: {
            type: "website", title, description, url: project.href,
            images: [{url: project.image, width: project.width, height: project.height, alt: `${project.title} preview`}],
        },
        twitter: {card: "summary_large_image", title, description, images: [project.image]},
    };
}

export default async function ProjectPage({params}: Props) {
    const {slug} = await params;
    const project = projects.find(project => project.id === slug);
    if (!project?.details) notFound();

    const details = project.details;
    const pageUrl = `https://solomk.in${project.href}`;
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: details.title,
        description: details.description,
        mainEntity: {
            "@type": "SoftwareApplication",
            name: project.title,
            description: details.description,
            url: new URL(project.appUrl, "https://solomk.in").href,
            image: `https://solomk.in${project.image}`,
            applicationCategory: details.applicationCategory,
            operatingSystem: details.operatingSystem,
            featureList: details.features.map(feature => feature.title),
            author: {"@type": "Person", name: "Maksym Solomkin", url: "https://solomk.in"},
        },
    };

    return (
        <article>
            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c")}} />
            <Link href="/#projects" className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" aria-hidden="true" /> All projects
            </Link>
            <header>
                <p className="page-kicker">{project.category}</p>
                <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">{project.title}</h1>
                <p className="mt-5 max-w-2xl text-xl leading-relaxed text-muted-foreground">{details.lede}</p>
                <p className="mt-4 text-sm text-muted-foreground">Built by Maksym Solomkin · {details.platform}</p>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Button asChild className="h-11 rounded-full px-5">
                        <Link href={project.appUrl}>{project.action} <ArrowUpRight aria-hidden="true" /></Link>
                    </Button>
                    {project.source && (
                        <Link href={project.source} className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                            Source on GitHub <ArrowUpRight className="size-4" aria-hidden="true" />
                        </Link>
                    )}
                </div>
            </header>

            <figure className="my-10 overflow-hidden rounded-xl border bg-muted sm:my-12">
                <Image src={project.image} alt={`${project.title} interface preview`} width={project.width} height={project.height}
                    sizes="(max-width: 1023px) 100vw, 960px" className="h-auto w-full" priority />
            </figure>

            <section className="grid gap-6 border-t py-9 sm:grid-cols-[1fr_2fr] sm:gap-12" aria-labelledby="about-title">
                <h2 id="about-title" className="font-display text-3xl tracking-tight">About the project</h2>
                <div className="space-y-4 text-base leading-8 text-muted-foreground">
                    {details.overview.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                </div>
            </section>

            <section className="border-t py-9" aria-labelledby="features-title">
                <h2 id="features-title" className="font-display text-3xl tracking-tight">What it does</h2>
                <dl className="mt-7 grid gap-x-12 gap-y-7 sm:grid-cols-2">
                    {details.features.map(feature => (
                        <div key={feature.title}>
                            <dt className="font-semibold">{feature.title}</dt>
                            <dd className="mt-2 text-sm leading-7 text-muted-foreground">{feature.description}</dd>
                        </div>
                    ))}
                </dl>
                {details.resource && (
                    <Link href={details.resource.href} className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm text-highlight hover:underline underline-offset-4">
                        {details.resource.label} <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                )}
            </section>

            <nav className="mt-3 border-t pt-8" aria-label="Other projects">
                <p className="page-kicker mb-4">Explore another project</p>
                <div className="flex flex-wrap gap-x-8 gap-y-2">
                    {projects.filter(other => other.id !== project.id).map(other => (
                        <Link key={other.id} href={other.href} className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                            {other.title} <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                    ))}
                </div>
            </nav>
        </article>
    );
}
