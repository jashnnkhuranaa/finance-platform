// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends(
        "next/core-web-vitals", // Keep Next.js recommended rules
        "plugin:react/recommended" // Add React recommended rules for JSX
    ),
    {
        files: ["**/*.js", "**/*.jsx"], // Apply to JavaScript and JSX files
        languageOptions: {
            ecmaVersion: "latest", // Use latest ECMAScript version
            sourceType: "module", // Use ES modules
            globals: {
                browser: true, // Browser globals (window, document, etc.)
                node: true, // Node.js globals (process, __dirname, etc.)
                es2021: true, // ES2021 globals
            },
        },
        rules: {
            "no-unused-vars": "error", // JavaScript default rule for unused variables
            "react/react-in-jsx-scope": "off", // Not needed with Next.js (React 17+)
            "react/prop-types": "off", // Not needed since we aren't using PropTypes
        },
        settings: {
            react: {
                version: "detect", // Auto-detect React version
            },
        },
    },
];

export default eslintConfig;