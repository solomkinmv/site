---
title: "Migration from Vite to Next.js while keeping Ant Design"
date: 2024-01-21
draft: false
tags: [ "nextjs", "frontend", "react" ]
---

# Problem Overview

I'm not a real frontend developer, so I'm just figuring out the whole ecosystem and step on every rake on my way.

I started [Shortcuts Disco](https://shortcuts.solomk.in) with Create React App, but apparently it's deprecated right now. Few months ago
I've tried to research alternatives and was surprised by the amount of different tools and frameworks.
Official React site [mentions](https://react.dev/learn/start-a-new-react-project) multiple build tools: Next.js, Remix,
Gatsby. I was so surprised that there are no "just React" option. So I researched a bit and found Vite which looks like
modern alternative for Create React App.

I've migrated my project to Vite and was happy with it. But then I realized that site is available only with JS which
makes it a blind spot for search engines. I've researched this topic and realized why do I need Server Side Rendering
for my application-like site. Additionally, I didn't want to host any service for this site, so I found out that there
are multiple React based frameworks that support nice blend of static and dynamic pages. I've chosen Next.js because
it's the most popular one, and I hope it will be supported for a long time.

![Migration from Vite to Next.js with Ant Design](images/vitejs-to-nextjs-migration/vitejs-to-nextjs-migration.webp)

# Learning Curve

As always, frontend world is a mess. There are multiple approaches for Next.js: Pages Router and App Router.
App Router is the new one, but there are rough edges, and I've seen a lot of comments that it's not ready for
production.
But I've decided to try it anyway, because it's the future and I don't want to migrate again in a year.

Initially I wanted to do this ad hoc with ChatGPT, but then I realized that it's not that straightforward and I need to
learn Next.js first.
Surprisingly, [official tutorial](https://nextjs.org/learn/dashboard-app) was very helpful and I got the basics in a few
evenings.

![Next.js Tutorial](https://nextjs.org/_next/image?url=%2Flearn%2Fdark%2Fdashboard.png&w=3840&q=75&dpl=dpl_42Sgxb1DrR4FHfR27frojTCdKMQA)

# Migration

My next problem appeared when I tried to migrate my ViteJS project to Next.js. I'm
using [Ant Design,](https://ant.design) and it's not compatible with Next.js and has some integration problems with App
Router. Official documentation [mentions](https://ant.design/docs/react/use-with-next) usage with Next.js, but Ant
Design uses a lot of JavaScript, and it's not compatible with Next.js Server Side Rendering, so you need to annotate
each file with `use client` directive.

Initially, I thought that this is a problem and I tried to migrate from
Ant Design to Tailwind based component libraries. That appeared to be a huge headache and required a lot of work.

Then I decided to configure static site generation with `use client` directive and check how it looks.
And it worked perfectly fine! The only trick was to extract page content to separate client component and use it in
server generated Page component. This page component fetched shortcuts data and passed it to client component as a prop.
During static site generation Next.js used that data and build perfectly good static page with all the data.

Example of page component:

```tsx
import {getAllShortcuts} from "@/lib/shortcuts";
import {ApplicationList} from "@/ui/applications/application-list";

const Page = () => {
    const allAppShortcuts = getAllShortcuts();
    return (
        <div>
            <ApplicationList applications={allAppShortcuts.applications}/>
        </div>
    );
};

export default Page;
```

Also, that allowed me to customize metadata for each page and add custom title and description.

```tsx
export function generateMetadata({params}: Props): Metadata {
    return {
        title: findApplication(params.slug)?.name,
    };
}
```

After realizing that I can use Ant Design with Next.js everything else was pretty straightforward.

I've configured Static Site Generation (SSG)
and [Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports), so it was possible
to deploy site to GitHub Pages as I did with ViteJS.

# Conclusion

In total, it took me around 3 evenings to learn basics of Next.js and migrate [Shortcuts Disco](shortcuts.solomk.in).

If anyone is interested you can take a closer look on the [PR](https://github.com/solomkinmv/shortcuts-disco/pull/48)
with migration.
