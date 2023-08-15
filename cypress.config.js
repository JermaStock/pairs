/* eslint-env node */
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    viewportWidth: 1000,
    viewportHeight: 1080,
  },
});
