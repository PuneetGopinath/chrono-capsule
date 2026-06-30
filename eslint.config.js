import { defineConfig } from "eslint/config";
import globals from "globals";
import eslintReact from "@eslint-react/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig({
    basePath: "./src",
    files: ["**/*.{js,jsx}"],
    languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: {
            ...globals.browser,
            ...globals.node
        },
        parserOptions: {
            ecmaFeatures: {
                jsx: true
            }
        }
    },
    plugins: {
        "react-hooks": reactHooks
    },
    extends: [
        "eslint:recommended",
        eslintReact.configs.recommended
    ],
    rules: {
        "semi": ["error", "always"],
        "quotes": ["error", "double"],
        "no-unused-vars": ["warn"],
        "no-console": ["warn"],

        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",

        "@eslint-react/naming-convention/component-name": "error",
        "@eslint-react/no-unstable-nested-components": "error"
    }
});