import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
    // Archivos y carpetas ignorados
    {
        ignores: [
            'node_modules/',
            'test-results/',
            'playwright-report/',
            'blob-report/',
            'coverage/',
            'dist/',
            'playwright.config.ts',
            'eslint.config.mjs',
            'yarn.lock',
            'allure-report/',
            'allure-results'
        ],
    },

    // Reglas JavaScript recomendadas
    js.configs.recommended,

    // Reglas TypeScript recomendadas
    ...tseslint.configs.recommended,

    // Reglas generales de estilo
    {
        plugins: {
            '@stylistic': stylistic,
        },

        rules: {
            // ==============================
            // FORMATO
            // ==============================

            // 4 espacios de indentación
            '@stylistic/indent': ['error', 4, {
                SwitchCase: 1,
            }],

            // Usar comillas simples
            '@stylistic/quotes': ['error', 'single', {
                avoidEscape: true,
            }],

            // Punto y coma obligatorio
            '@stylistic/semi': ['error', 'always'],

            // Espacios antes/después de operadores
            '@stylistic/space-infix-ops': 'error',

            // Espacio después de coma
            '@stylistic/comma-spacing': [
                'error',
                {
                    before: false,
                    after: true,
                },
            ],

            // Espacio después de palabras clave
            '@stylistic/keyword-spacing': 'error',

            // Espacios alrededor de bloques
            '@stylistic/brace-style': [
                'error',
                '1tbs',
                {
                    allowSingleLine: true,
                },
            ],

            // Máximo de caracteres por línea
            '@stylistic/max-len': [
                'warn',
                {
                    code: 120,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreComments: true,
                },
            ],

            // ==============================
            // VARIABLES
            // ==============================

            // No permitir variables sin utilizar
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],

            // No utilizar any
            '@typescript-eslint/no-explicit-any': 'warn',

            // ==============================
            // NOMBRAMIENTO DE VARIABLES
            // ==============================

            '@typescript-eslint/naming-convention': [
                'error',

                // Variables y parámetros -> camelCase
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE'],
                },

                // Funciones -> camelCase
                {
                    selector: 'function',
                    format: ['camelCase'],
                },

                // Métodos -> camelCase
                {
                    selector: 'method',
                    format: ['camelCase'],
                },

                // Propiedades -> camelCase
                {
                    selector: 'property',
                    format: ['camelCase', 'snake_case'],
                },

                // Clases -> PascalCase
                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },

                // Interfaces -> PascalCase
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                },

                // Type aliases -> PascalCase
                {
                    selector: 'typeAlias',
                    format: ['PascalCase'],
                },

                // Enums -> PascalCase
                {
                    selector: 'enum',
                    format: ['PascalCase'],
                },

                // Enum members -> UPPER_CASE
                {
                    selector: 'enumMember',
                    format: ['UPPER_CASE'],
                },
            ],

            // ==============================
            // TYPESCRIPT
            // ==============================

            // Evitar tipos innecesarios
            '@typescript-eslint/no-inferrable-types': 'error',

            // Preferir interfaces/types correctamente definidos
            '@typescript-eslint/consistent-type-definitions': [
                'error',
                'interface',
            ],
        },
    },

    // ==============================
    // PLAYWRIGHT
    // ==============================

    {
        files: ['tests/**/*.ts'],

        ...playwright.configs['flat/recommended'],

        rules: {
            // No permitir test.only
            'playwright/no-focused-test': 'error',

            // No permitir tests skip
            'playwright/no-skipped-test': 'warn',

            // Evitar waitForTimeout
            'playwright/no-wait-for-timeout': 'warn',

            // Preferir expect() inmediatamente sobre condiciones reales
            'playwright/prefer-web-first-assertions': 'warn',

            // Los tests deberían tener assertions
            'playwright/expect-expect': 'warn',

            // Preferir locators
            'playwright/prefer-locator': 'warn',

            // Evitar selectores CSS innecesarios
            'playwright/no-raw-locators': 'off',
        },
    },

    // ==============================
    // PAGE OBJECTS
    // ==============================

    {
        files: ['pages/**/*.ts'],

        rules: {
            '@typescript-eslint/no-unused-vars': 'error',

            '@typescript-eslint/naming-convention': [
                'error',

                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE'],
                },

                {
                    selector: 'function',
                    format: ['camelCase'],
                },

                {
                    selector: 'method',
                    format: ['camelCase'],
                },

                {
                    selector: 'property',
                    format: ['camelCase', 'UPPER_CASE'],
                },

                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },
            ],
        },
    },
);