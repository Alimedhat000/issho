import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import prettierPlugin from 'eslint-plugin-prettier';

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
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': ['error'],
    },
  },
];

export default config;
