# @iodigital/vite-plugin-prism

[Prism](https://github.com/stoplightio/prism), OpenAPI mocking server, integration for Vite

## Usage

### Install

```sh
npm install --save-dev @iodigital/vite-plugin-prism
# yarn add --dev @iodigital/vite-plugin-prism
# pnpm add --save-dev @iodigital/vite-plugin-prism
```

### Add to Vite config

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

---

## Config

```ts
interface VitePluginPrismOptions {
  // URL to OpenAPI document or OpenAPI document object
  specFilePathOrObject: string | object;
  // Prism HTTP server configuration https://github.com/stoplightio/prism/tree/master/packages/http#config-object
  prismConfig?: IClientConfig;
  // Turn on Prism logging
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

### Build

```
npm run build
```
