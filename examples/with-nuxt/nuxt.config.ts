import { defineNuxtConfig } from "nuxt/config";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false, // TODO: test with SSR, didn't work in rc9
  modules: [["../../dist/nuxt"]],
  prism: [
    {
      specFilePathOrObject: "../fixtures/petstore.yml",
      debug: true,
    },
  ],
});
