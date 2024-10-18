// babel.config.cjs
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
      modules: false, // This ensures Babel doesn't transform ES modules into CommonJS
    }],
  ],
};
