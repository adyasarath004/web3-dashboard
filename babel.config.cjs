// babel.config.js
// Jest doesn't use Vite to process files, so it needs its own way
// to understand JSX and modern JS syntax. Babel handles that here.

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
}