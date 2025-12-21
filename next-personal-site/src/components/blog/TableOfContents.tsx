'use client';

import {useEffect, useState, useCallback, useRef} from 'react';
import {cn} from '@/lib/utils';

interface Heading {
    id: string;
    text: string;
    level: number;
}

const HEADING_SELECTOR = 'h2, h3';
const SCROLL_OFFSET = 128; // Matches top-32 (8rem = 128px)

function getHeadingElements(article: HTMLElement): HTMLHeadingElement[] {
    const elements = Array.from(article.querySelectorAll(HEADING_SELECTOR));
    return elements.filter((el): el is HTMLHeadingElement =>
        el instanceof HTMLHeadingElement
    );
}

function generateHeadingId(text: string, index: number): string {
    const slug = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return slug || `heading-${index}`;
}

export function TableOfContents() {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const headingElementsRef = useRef<HTMLHeadingElement[]>([]);
    const rafIdRef = useRef<number | null>(null);

    useEffect(() => {
        const article = document.querySelector('article');
        if (!article) return;

        const elements = getHeadingElements(article);
        headingElementsRef.current = elements;

        const items: Heading[] = elements
            .map((el, index) => ({
                id: el.id || generateHeadingId(el.textContent?.trim() ?? '', index),
                text: el.textContent?.trim() ?? '',
                level: el.tagName === 'H2' ? 2 : 3,
            }))
            .filter((h): h is Heading => h.text !== '');

        setHeadings(items);
    }, []);

    const updateActiveHeading = useCallback(() => {
        const elements = headingElementsRef.current;
        if (elements.length === 0) return;

        const scrollY = window.scrollY;

        let currentIndex = 0;
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].offsetTop <= scrollY + SCROLL_OFFSET) {
                currentIndex = i;
            }
        }

        setActiveIndex(currentIndex);
    }, []);

    useEffect(() => {
        if (headings.length === 0) return;

        const throttledUpdate = () => {
            if (rafIdRef.current !== null) return;
            rafIdRef.current = requestAnimationFrame(() => {
                updateActiveHeading();
                rafIdRef.current = null;
            });
        };

        throttledUpdate();
        window.addEventListener('scroll', throttledUpdate, {passive: true});

        return () => {
            window.removeEventListener('scroll', throttledUpdate);
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [headings.length, updateActiveHeading]);

    const handleClick = (index: number) => {
        const elements = headingElementsRef.current;
        if (elements[index]) {
            elements[index].scrollIntoView({behavior: 'smooth'});
            setActiveIndex(index);
        }
    };

    if (headings.length === 0) {
        return null;
    }

    return (
        <nav
            className="hidden xl:block fixed top-32 w-56 max-h-[calc(100vh-10rem)] overflow-y-auto left-[calc(50%+385px+1rem)]"
            aria-label="Table of contents"
        >
            <p className="text-sm font-semibold text-foreground mb-4">On this page</p>
            <ul className="space-y-2 text-sm" role="list">
                {headings.map(({id, text, level}, index) => (
                    <li key={id}>
                        <button
                            type="button"
                            className={cn(
                                'block w-full text-left text-muted-foreground hover:text-foreground transition-colors',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
                                level === 3 && 'pl-4',
                                activeIndex === index && 'text-foreground font-medium'
                            )}
                            onClick={() => handleClick(index)}
                            aria-current={activeIndex === index ? 'location' : undefined}
                        >
                            {text}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
