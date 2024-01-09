import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";

import solid from "@astrojs/solid-js"

export default defineConfig({
  site: "https://astroship.web3templates.com",
  output: "server",
  integrations: [
    tailwind(),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    solid()
  ],
});
