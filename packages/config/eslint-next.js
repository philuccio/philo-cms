/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    './eslint-base.js',
    'next/core-web-vitals',
    'next/typescript',
  ],
  rules: {
    '@next/next/no-html-link-for-pages': 'error',
    'react/self-closing-comp': 'error',
    'react/jsx-sort-props': ['warn', { callbacksLast: true, shorthandFirst: true }],
  },
}
