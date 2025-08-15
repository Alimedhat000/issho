import { FlatCompat } from '@eslint/eslintrc';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

const ignores = {
  ignores: [
    '**/node_modules/**',
    '.next/**',
    'dist/**',
    'src/generated/**',
    'build/**',
    '*.config.js',
  ],
};

const config = [
  ignores,
  ...eslintConfig,
  eslintConfigPrettier,
  {
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'prettier/prettier': ['error'],
      '@typescript-eslint/no-explicit-any': 'warn',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^@?\\w'],
            ['^(@|components)(/.*|$)'],
            ['^\\u0000'],
            ['^\\.'],
            ['^\\./(?=.*/)(?!.*\\.(css|scss|less)$)[^.]+$'],
            ['^.+\\.(css|scss|less)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
];

export default config;
