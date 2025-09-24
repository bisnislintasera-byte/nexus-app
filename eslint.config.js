// eslint.config.js
const next = require('@next/eslint-plugin-next');

module.exports = [
  next.configs.recommended,
  next.configs['core-web-vitals'],
];
