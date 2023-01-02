import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Unocss
import Unocss from "unocss/vite";
import presetAttributify from "@unocss/preset-attributify";
import presetMini from "@unocss/preset-mini";
import presetTypography from "@unocss/preset-typography";
import presetUno from "@unocss/preset-uno";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss({
      presets: [
        presetAttributify(),
        presetMini(),
        presetTypography(),
        presetUno(),
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
