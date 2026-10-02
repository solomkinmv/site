# Blog image style

Use this guide for the personal blog's illustrations. Read the post before choosing a visual metaphor. Each post gets two separately generated compositions in the same style.

## Shared prompt

Append the post's subject and one of the framing prompts below:

```text
Create a polished editorial illustration for a minimalist software engineer's
personal blog. Use a warm ivory paper background (#F8F7F5), charcoal ink
(#282624), burnt-orange accents (#B55B38), and restrained warm gray shapes.
Use precise geometric silhouettes, technical ink lines, subtle cut-paper
layering, delicate paper grain, and gentle physical shadows. The mood is
quiet, warm, and thoughtful. Build a clear visual metaphor for the post's
actual topic. Keep all meaningful objects well inside the canvas.
Avoid glossy renders, gradients, neon, futuristic tech scenery, clutter,
generic stock imagery, fake screenshots, watermarks, borders, and headlines.
Prefer symbols and abstract code marks over text. Do not invent technical
claims, code examples, certificates, or product interfaces in the artwork.
```

## Cover framing

```text
Asset: main article cover and social sharing image.
Composition: panoramic landscape, 1.91:1 aspect ratio, balanced negative
space. Main objects occupy the central 65 percent. Supporting context can
explain the topic, but the focal point must remain clear. One illustration,
not a collage or contact sheet.
```

Export as a 1200 × 630 WebP. Set frontmatter `image` to its public URL and place the decorative cover at the start of the article using `![|no-zoom](...)`.

## Thumbnail framing

```text
Asset: dedicated blog-list thumbnail.
Composition: landscape 4:3. A bold, close composition with one dominant
subject filling about 70 percent of the canvas. Simplify the cover's visual
idea so it remains recognizable at 192 × 144 pixels. Avoid background
furniture, room scenes, tiny details, and unnecessary secondary objects.
One illustration, not a collage or contact sheet.
```

Export as a 960 × 720 WebP and set frontmatter `cardImage` to its public URL. Generate this composition separately; a crop of the cover does not replace a dedicated thumbnail.

## References and delivery

- Inspect the existing [AWS cover](../public/images/aws-certified-cloud-practitioner/cover-2026-10-02.webp) and [AWS thumbnail](../public/images/aws-certified-cloud-practitioner/card-2026-10-02.webp) for the palette, texture, and difference in framing. Borrow the style, not the subject.
- Use `public/images/<post-slug>/cover-YYYY-MM-DD.webp` and `card-YYYY-MM-DD.webp`. Keep older assets and instructional screenshots intact.
- Review both compositions, their small-size readability, and their rendering in the article and post list. Check that sharing metadata uses the cover.
- Preserve the post's draft status. Run the build and export checks after updating MDX.
