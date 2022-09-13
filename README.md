# @iodigital/vite-plugin-prism

[Prism](https://github.com/stoplightio/prism), OpenAPI mocking server, integration for Vite

## Usage

### Install

```sh
npm install --save-dev @iodigital/vite-plugin-prism
# yarn add --dev @iodigital/vite-plugin-prism
# pnpm add --save-dev @iodigital/vite-plugin-prism
```

### Vite

```ts
// Import plugin
import prism from "@iodigital/vite-plugin-prism";

// Pass them to plugin
export default defineConfig({
  plugins: [
    prism({
      // OpenAPI doc
      specFilePathOrObject:
        "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore-expanded.yaml",
    }),
  ],
});
```

### Nuxt

```ts
import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    [
      "@iodigital/vite-plugin-prism",
      {
        specFilePathOrObject:
          "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore-expanded.yaml",
      },
    ],
  ],

  // or
  modules: ["@iodigital/vite-plugin-prism"],
  prism: {
    specFilePathOrObject:
      "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore-expanded.yaml",
  },
});
```

### Config

```ts
interface PrismPluginOptions {
  
  // Base path for API
  // Default: /api
  route?: string;

  // URL to OpenAPI document or OpenAPI document object
  specFilePathOrObject: string | object;

  // Prism HTTP server configuration, same as Prism's IHttpConfig
  // https://github.com/stoplightio/prism/tree/master/packages/http#config-object
  // Default:
  // {
  //   mock: { dynamic: true },
  //   validateRequest: true,
  //   validateResponse: true,
  //   checkSecurity: true,
  //   errors: true,
  // };
  prismConfig?: PrismConfig;

  // Turn on Prism logging
  // Default: false
  debug?: boolean;
}
```

---

## Development

```
npm run dev
```

### Example vite application with plugin

```
npm run build
cd examples/with-vite
npm run dev
curl http://localhost:3000/api/pets
```

### Example Nuxt application with plugin

```
npm run build
cd examples/with-nuxt
npm run dev
curl http://localhost:3000/api/pets
```

### Build

```
npm run build
```
