import Image from "next/image";
import Link from "next/link";
import {ArrowDown, ArrowRight, ArrowUpRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import ListItem from "@/components/blog/ListItem";
import {getPostsMeta} from "@/lib/posts";
import {projects} from "@/lib/projects";

export default async function HomePage() {
    const posts = await getPostsMeta();

    return (
        <>
            <section className="grid items-center gap-10 pb-16 pt-4 sm:pb-20 sm:pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.58fr)] md:gap-12" aria-labelledby="intro">
                <div>
                    <p className="page-kicker flex items-center gap-3">
                        <span className="h-px w-8 bg-highlight" aria-hidden="true" />
                        Software engineer
                    </p>
                    <h1 id="intro" className="mt-6 font-display text-[clamp(3.5rem,8.5vw,6.5rem)] leading-[1.05] tracking-[-0.045em]">
                        Maksym <span className="italic">Solomkin.</span>
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                        I build distributed backend systems and useful tools.
                        This is where I share my projects and what I learn along the way.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm sm:gap-x-6">
                        <Button asChild variant="outline" className="h-11 rounded-full px-5 shadow-none">
                            <a href="#projects">Explore my work <ArrowDown aria-hidden="true" /></a>
                        </Button>
                        <Link href="https://github.com/solomkinmv" className="inline-flex min-h-11 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground">
                            GitHub <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        </Link>
                        <Link href="https://www.linkedin.com/in/solomkinmv/" className="inline-flex min-h-11 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground">
                            LinkedIn <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
                <figure className="mx-auto w-full max-w-64 rotate-[-2deg] rounded-sm border border-foreground/20 bg-card p-3 shadow-sm md:mx-0 md:max-w-80 md:justify-self-end">
                    <Image src="/images/maksym-portrait-2026-10-02.webp" alt="Illustrated portrait of Maksym Solomkin"
                        width={960} height={960} sizes="(max-width: 767px) 232px, 296px" preload
                        className="aspect-square h-auto w-full rounded-[1px] border border-foreground/10" />
                </figure>
            </section>

            <section id="projects" className="scroll-mt-8 border-t pt-8" aria-labelledby="projects-title">
                <div className="mb-8 flex items-baseline justify-between gap-4">
                    <h2 id="projects-title" className="text-xl font-semibold tracking-tight">Selected projects</h2>
                    <span className="page-kicker" aria-hidden="true">01 / Work</span>
                </div>
                <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                    {projects.map(project => (
                        <Card key={project.id} id={project.id} className="group gap-5 rounded-none border-0 bg-transparent py-0 shadow-none">
                            <Link href={project.href} aria-label={`About ${project.title}`} className="block overflow-hidden rounded-xl border bg-muted">
                                <div className="flex aspect-[2/1] items-center justify-center transition-transform duration-300 motion-safe:group-hover:scale-[1.02]">
                                    {project.image ? (
                                        <Image src={project.image} alt={`${project.title} preview`} width={project.width} height={project.height}
                                            sizes="(max-width: 639px) 100vw, 50vw" className="h-full w-full object-contain" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center gap-4 px-6 py-5">
                                            {[
                                                ["achi-main", "АКМІ procedure classifications"],
                                                ["idc-10-main", "МКХ-10 diagnosis classifications"],
                                                ["achi-bookmarks", "Saved medical codes"],
                                            ].map(([image, alt]) => (
                                                <Image key={image} src={`/images/apps/medical-codes/${image}.webp`} alt={alt}
                                                    width={1242} height={2688} className="h-full w-auto min-w-0 rounded-lg object-contain shadow-sm" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                            <CardContent className="px-0">
                                <p className="page-kicker mb-2">{project.category}</p>
                                <h3 className="text-xl font-semibold tracking-tight">
                                    <Link href={project.href} className="inline-flex items-center gap-2 transition-colors hover:text-highlight">
                                        {project.title} <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
                                    </Link>
                                </h3>
                                <p className="mt-2 text-sm leading-7 text-muted-foreground">{project.description}</p>
                                <div className="mt-2 flex flex-wrap gap-x-5 text-xs text-muted-foreground">
                                    <Link href={project.href} className="inline-flex min-h-11 items-center gap-1 underline-offset-4 hover:text-foreground hover:underline">
                                        About the project <ArrowRight className="size-3" aria-hidden="true" />
                                    </Link>
                                    <Link href={project.appUrl} className="inline-flex min-h-11 items-center gap-1 underline-offset-4 hover:text-foreground hover:underline">
                                        {project.action} <ArrowUpRight className="size-3" aria-hidden="true" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {posts && posts.length > 0 && (
                <section className="mt-16 border-t pt-8 sm:mt-20" aria-labelledby="writing-title">
                    <div className="mb-4 flex items-baseline justify-between gap-4">
                        <h2 id="writing-title" className="text-xl font-semibold tracking-tight">Recent writing</h2>
                        <span className="page-kicker" aria-hidden="true">02 / Writing</span>
                    </div>
                    <ul className="list-none divide-y p-0">
                        {posts.slice(0, 3).map(post => <ListItem key={post.id} post={post} />)}
                    </ul>
                    <Link href="/posts" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                        All posts <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                </section>
            )}

            <section id="connect" className="mt-16 flex flex-col items-start justify-between gap-6 border-t pt-10 sm:mt-20 sm:flex-row sm:items-center" aria-labelledby="connect-title">
                <div>
                    <h2 id="connect-title" className="font-display text-4xl tracking-tight">Let’s connect.</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Find me on GitHub, LinkedIn, or around the web.</p>
                </div>
                <Button asChild className="h-11 rounded-full px-5">
                    <Link href="https://www.linkedin.com/in/solomkinmv/">Say hello on LinkedIn <ArrowUpRight aria-hidden="true" /></Link>
                </Button>
            </section>
        </>
    );
}
