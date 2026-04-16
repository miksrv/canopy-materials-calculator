import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import importPlugin from 'eslint-plugin-import'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig([
    // Register all plugins up-front
    {
        plugins: {
            ['@typescript-eslint']: tseslint.plugin,
            ['react']: reactPlugin,
            ['react-hooks']: reactHooksPlugin,
            ['react-refresh']: reactRefreshPlugin,
            ['import']: importPlugin,
            ['prettier']: prettierPlugin,
            ['simple-import-sort']: simpleImportSortPlugin,
        },
        extends: [prettierConfig],
    },

    // Ignored paths
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/eslint.config.mjs',
            '**/vite.config.ts',
            '**/vite.widget.config.ts',
        ],
    },

    // TypeScript recommended rules
    ...tseslint.configs.recommended,

    {
        files: ['**/*.{ts,tsx}'],

        languageOptions: {
            parserOptions: {
                projectService: true,
                warnOnUnsupportedTypeScriptVersion: false,
            },
        },

        settings: {
            react: {
                version: 'detect',
            },
        },

        rules: {
            //
            // eslint-base
            //
            // ✅ Requires curly braces for all control statements
            curly: ['error', 'all'],
            // ✅ Disallow semicolons
            semi: ['error', 'never'],
            // ✅ Require === and !==
            eqeqeq: ['error', 'always', { null: 'never' }],
            // ✅ Error when the same module is imported multiple times
            'no-duplicate-imports': 'error',
            // ✅ Enforce using logical assignment operators (&&=, ||=, ??=)
            'logical-assignment-operators': 'error',
            // ✅ Disallow return in else after if with return
            'no-else-return': 'error',
            // ✅ Disallow console except console.warn and console.error
            'no-console': ['error', { allow: ['warn', 'error'] }],
            // ✅ Disallow fallthrough in switch/case
            'no-fallthrough': ['error', { commentPattern: '.*intentional fallthrough.*' }],
            // ✅ Warn if double quotes used instead of single quotes
            quotes: ['warn', 'single'],
            // ✅ Disallow declaring multiple variables in one statement
            'one-var': ['error', 'never'],
            // ✅ Warn if lines exceed 120 characters
            'max-len': [
                'warn',
                {
                    code: 120,
                    ignoreUrls: true,
                    ignoreTemplateLiterals: true,
                    ignoreStrings: true,
                    ignoreComments: true,
                },
            ],
            // ✅ Enforce consistent spacing inside braces
            'object-curly-spacing': ['error', 'always'],
            'object-curly-newline': 'off',
            // ✅ Enforce empty line after last import
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: 'import', next: '*' },
                { blankLine: 'any', prev: 'import', next: 'import' },
            ],
            // ✅ Disallow constant conditions
            'no-constant-condition': 'error',

            //
            // eslint-plugin-prettier
            //
            'prettier/prettier': 'error',

            //
            // typescript-eslint
            //
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-var-requires': 'warn',
            '@typescript-eslint/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: true }],
            '@typescript-eslint/prefer-string-starts-ends-with': ['error', { allowSingleElementEquality: 'always' }],
            '@typescript-eslint/unbound-method': 'off',
            // Off for React components — they don't use class accessibility modifiers
            '@typescript-eslint/explicit-member-accessibility': 'off',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/await-thenable': 'warn',
            '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
            '@typescript-eslint/no-invalid-this': 'error',
            '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
            '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
            '@typescript-eslint/switch-exhaustiveness-check': 'error',
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                { allowNumber: true, allowBoolean: false, allowAny: false },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    caughtErrors: 'all',
                    varsIgnorePattern: '^_',
                    argsIgnorePattern: '^_',
                    ignoreRestSiblings: false,
                },
            ],

            //
            // react
            //
            'react-hooks/exhaustive-deps': 'off',
            'react/prop-types': 'off',
            'react/no-unsafe': 'error',
            'react/no-access-state-in-setstate': 'error',
            'react-hooks/rules-of-hooks': 'error',
            'react/prefer-stateless-function': ['warn', { ignorePureComponents: true }],
            'react/jsx-key': 'error',
            'react/jsx-max-depth': ['warn', { max: 10 }],
            'react/jsx-max-props-per-line': ['warn', { maximum: 1, when: 'multiline' }],
            'react/jsx-fragments': ['warn', 'syntax'],

            //
            // react-refresh (Vite HMR)
            //
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

            //
            // eslint-plugin-import
            //
            'import/first': 'error',
            'import/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
                },
            ],
            'import/no-cycle': ['warn', { maxDepth: Infinity }],
            'import/no-absolute-path': 'error',
            'import/no-unresolved': 'off',
            'import/no-duplicates': 'warn',
            'import/no-self-import': 'error',
            'import/consistent-type-specifier-style': ['error', 'prefer-inline'],

            //
            // eslint-plugin-simple-import-sort
            //
            'simple-import-sort/exports': 'error',
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        // react comes first
                        ['^react', '^\\w'],
                        // npm packages
                        ['^@?\\w'],
                        // relative imports (parent)
                        ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                        // relative imports (current folder)
                        ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                        // type-only imports
                        ['^.+\\.d\\.ts$', '^\\u0000'],
                        // styles / JSON / assets
                        ['^.+\\.css$', '^.+\\.json$', '^.+\\.svg$', '^.+\\.png$'],
                    ],
                },
            ],
        },
    },
])
