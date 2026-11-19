import baseConfig from "../../eslint.config.js";
import tseslint from "typescript-eslint";
import reactXPlugin from "eslint-plugin-react-x";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  ...baseConfig,
  prettier,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-x": reactXPlugin,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...reactXPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react-x/react-in-jsx-scope": "off",
      // DEV_NOTE: Form controls look like the app, never the browser (CLAUDE.md, "Form controls").
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name='select']",
          message: "Use AppSelect (components/AppSelect.tsx), never a native <select>.",
        },
        {
          selector:
            "JSXAttribute[name.name='type'][value.value=/^(date|time|datetime-local|month|week|color)$/]",
          message: "Use AppDatePicker / AppTimePicker, never a native date, time or color input.",
        },
        {
          selector: "CallExpression[callee.name=/^(alert|confirm|prompt)$/]",
          message: "Use a Dialog or a toast, never alert / confirm / prompt.",
        },
      ],
    },
  },
  {
    files: ["**/shadcn/**"],
    rules: {
      "react-x/no-array-index-key": "off",
    },
  },
);
