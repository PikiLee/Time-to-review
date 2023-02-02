import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Unocss
import Unocss from "unocss/vite";
import presetAttributify from "@unocss/preset-attributify";
import presetMini from "@unocss/preset-mini";
import presetTypography from "@unocss/preset-typography";
import presetUno from "@unocss/preset-uno";
import UnocssIcons from "@unocss/preset-icons";

// element ui
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

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
				UnocssIcons({
					prefix: "i-",
					extraProperties: {
						display: "inline-block",
					},
				}),
			],
		}),
		AutoImport({
			resolvers: [ElementPlusResolver()],
		}),
		Components({
			resolvers: [ElementPlusResolver()],
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
