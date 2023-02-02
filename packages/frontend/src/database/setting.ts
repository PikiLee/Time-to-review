import { createGlobalState, useStorage } from "@vueuse/core";

export const useSetting = createGlobalState(() =>
	useStorage("settings", {
		progressStageInterval: {
			0: 1,
			1: 7,
			2: 14,
			3: 28,
			4: NaN,
		},
	})
);
