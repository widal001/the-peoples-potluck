// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
  },

  compressHTML: false,
  trailingSlash: "always",
  integrations: [mdx()],
  adapter: cloudflare({
    imageService: "compile",
  }),
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
});
