import { defineConfig } from "vite";
import prism from "../../dist";

const prismPluginSharedConfig = {
  prismConfig: {
    mock: {
      dynamic: true,
    },
  },
  debug: true,
};

export default defineConfig({
  plugins: [
    prism([
      {
        route: "/api-one",
        pathRewrite: async (path) => {
          if (path.includes("/full/path/to/rewrite")) return path.replace("/full", "");
          return path;
        },
        specFilePathOrObject: ["./openapi-one.yml"],
        ...prismPluginSharedConfig,
      },
      {
        route: "/api-two",
        specFilePathOrObject: ["./openapi-two.yml"],
        ...prismPluginSharedConfig,
      },
    ]),
  ],
});
