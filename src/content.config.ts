// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";

// 2. Import loader(s)
import { glob } from "astro/loaders";

const YearDate = z.number().int().min(2013).max(new Date().getFullYear());
const YearDateIncludingNow = z.union([YearDate, z.literal("now")]);

const Work = z
  .object({
    title: z.string(),
    subtitle: z.string().optional(),
    heroImage: z.string(),
    focusLevel: z.number().optional().default(0.5),
    client: z.string().optional(),
    tags: z.array(z.enum(["design", "code", "draw"])),
    tasks: z.array(z.string()),
    tools: z.array(z.string()).optional(),
  })
  .and(
    z.union([
      z.object({
        year: z.undefined(),
        startYear: YearDate,
        endYear: YearDateIncludingNow,
      }),
      z.object({
        year: YearDate,
        startYear: z.undefined(),
        endYear: z.undefined(),
      }),
    ])
  );

// 3. Define your collection(s)
const works = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdx}", "!**/_*"],
    base: "./content/works",
  }),
  schema: Work,
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { works };
