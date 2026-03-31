// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import glsl from "vite-plugin-glsl";


import vue from '@astrojs/vue';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  output: "static",
    integrations: [mdx(), sitemap(), vue(), svelte()],
      vite: {
    plugins: [glsl({ warnDuplicatedImports: false })],
  },
});