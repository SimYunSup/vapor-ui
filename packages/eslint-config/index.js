// @ts-check
import * as eslintJs from './javascript.js';
import * as typescript from './typescript.js';
import globals from 'globals';

export const js = eslintJs.getConfig({ ...globals.node, ...globals.browser });
export const ts = typescript.config;

/** @type {import("eslint").Linter.Config} */
export const overrides = {
    ignores: ['dist/**', '.next/**'],
    rules: {
        'prefer-const': ['warn', { destructuring: 'all' }],
    },
};

/** @type {import("eslint").Linter.Config[]} */
export const configs = [js, ts, overrides];
