module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "google",
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
        sourceType: "module",
    },
    ignorePatterns: [
        "/lib/**/*", // Ignore built files.
        "/generated/**/*", // Ignore generated files.
    ],
    plugins: [
        "@typescript-eslint",
        "import",
    ],
    rules: {
        "import/no-unresolved": "warn",
        "quotes": ["error", "double"],
        "indent": ["error", 4],
        "semi": ["error", "always"],
        "object-curly-spacing": ["error", "always"],
        "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1 }],
        "eol-last": ["error", "always"],
        "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
        "max-len": ["warn", { "code": 180 }],
    },
};
