import { defineConfig } from "vite";
import prism from "../../dist";

export default defineConfig({
  plugins: [
    prism({
      specFilePathOrObject: ["./openapi-one.yml", "./openapi-two.yml"],
      prismConfig: {
        mock: {
          dynamic: true,
        },
      },
      debug: true,
    }),
  ],
});
