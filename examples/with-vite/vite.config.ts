import { defineConfig } from "vite";
import prism from "../../";

export default defineConfig({
  plugins: [
    prism([
      {
        specFilePathOrObject:
          "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore-expanded.yaml",
        debug: true,
      },
    ]),
  ],
});
