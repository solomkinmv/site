import type {MDXComponents} from 'mdx/types'
import {
    TypographyH1,
    TypographyH2,
    TypographyH3,
    TypographyH4,
    TypographyLink, TypographyList, TypographyListItem,
    TypographyP
} from "@/components/ui/typography";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Allows customizing built-in components, e.g. to add styling.
        h1: TypographyH1,
        h2: TypographyH2,
        h3: TypographyH3,
        h4: TypographyH4,
        p: TypographyP,
        a: TypographyLink,
        ul: TypographyList,
        li: TypographyListItem,
        // img: (props) => (
        //   <Image
        //     sizes="100vw"
        //     style={{width: '100%', height: 'auto'}}
        //     {...(props as ImageProps)}
        //   />
        // ),
        ...components,
    }
}
