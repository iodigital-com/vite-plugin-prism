import { defineConfig } from "vite";
import prism from "../../dist";
import * as interceptors from "./interceptors";

export default defineConfig({
  plugins: [
    prism([
      {
        specFilePathOrObject:
          "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore-expanded.yaml",
        debug: true,
        interceptors,
      },
    ]),
  ],
});
