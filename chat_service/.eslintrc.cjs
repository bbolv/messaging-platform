module.exports = {
    env: {
        es2022: true,
        node: true
    },
    extends: ["eslint:recommended", "prettier"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },
    overrides: [
        {
            files: ["**/*.ts"],
            parser: "@typescript-eslint/parser",
            plugins: ["@typescript-eslint"],
            extends: ["plugin:@typescript-eslint/recommended", "prettier"],
            rules: {
                "no-unused-vars": "off",
                "@typescript-eslint/no-unused-vars": [
                    "warn",
                    { argsIgnorePattern: "^_" }
                ]
            }
        },
        {
            files: ["tests/**/*.{js,ts}"],
            env: {
                jest: true
            }
        }
    ],
    rules: {
        "no-console": "off",
        "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
    }
};
