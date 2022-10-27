import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false, // TODO: test with SSR, didn't work in rc9
  modules: [
    [
      "../../dist/nuxt",
      [
        {
          specFilePathOrObject:
            "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore-expanded.yaml",
          debug: true,
        },
      ],
    ],
  ],
});
