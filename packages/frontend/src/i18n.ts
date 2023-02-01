import { createI18n } from "vue-i18n";
import { messages } from "shared";

export const i18n = createI18n({
	locale: "en", // set locale
	fallbackLocale: "en", // set fallback locale
	messages,
});
