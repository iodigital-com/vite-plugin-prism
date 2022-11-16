import { defineConfig } from "vite";
import prism from "../../";

export default defineConfig({
  plugins: [
    prism([
      {
        specFilePathOrObject: "../fixtures/petstore.yml",
        debug: true,
      },
    ]),
  ],
});
