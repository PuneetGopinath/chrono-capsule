import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import eslintReact from "@eslint-react/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig(
    js.configs.recommended,
    eslintReact.configs.recommended,
    {
        files: ["src/**/*.{js,jsx}"],
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
        rules: {
            "semi": ["error", "always"],
            "quotes": ["error", "double"],
            "no-unused-vars": ["warn"],
            "no-console": ["warn"],

            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            "@eslint-react/no-nested-component-definitions": "error"
        }
    }
);