// https://typescript-eslint.io/getting-started

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
// import globals from "globals";

export default defineConfig({
	files: ["**/*.{ts,js}"],

	ignores: ["dist", "node_modules", "jest.config.js"],

	extends: [
		js.configs.recommended,
		...tseslint.configs.recommendedTypeChecked,
	],

	languageOptions: {
		// globals: globals.node,`
		parserOptions: {
			projectService: true,
			tsconfigRootDir: import.meta.dirname,
		},
	},

	rules: {
		"no-console": "off",
		"dot-notation": "error"
	},
});