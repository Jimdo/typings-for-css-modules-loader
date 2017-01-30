module.exports = {
  entry: './test/entry.ts',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.ts$/, loaders: ['babel', 'ts'] },
      { test: /example\.css$/, loader: '../src/index.js?modules' },
      { test: /example-camelcase\.css$/, loader: '../src/index.js?modules&camelCase' },
      { test: /example-namedexport\.css$/, loader: '../src/index.js?modules&namedExport' },
      { test: /example-camelcase-namedexport\.css$/, loader: '../src/index.js?modules&camelCase&namedExport' },
      { test: /example-no-css-modules\.css$/, loader: '../src/index.js' },
      { test: /example-compose\.css$/, loader: '../src/index.js?modules&camelCase&namedExport' }
    ]
  }
};
