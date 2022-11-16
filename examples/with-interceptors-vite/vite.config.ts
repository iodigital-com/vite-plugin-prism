import { defineConfig } from "vite";
import prism from "../../dist";
import * as interceptors from "./interceptors";

export default defineConfig({
  plugins: [
    prism([
      {
        specFilePathOrObject: "../fixtures/petstore.yml",
        debug: true,
        interceptors,
      },
    ]),
  ],
});
