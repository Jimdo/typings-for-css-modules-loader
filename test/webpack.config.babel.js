const loader   = require.resolve('../lib/index.js');
module.exports = {
  entry : './test/entry.ts',
  output: {
    path    : __dirname,
    filename: 'bundle.js',
  },
  mode  : 'development',
  module: {

    rules: [
      {test: /\.ts$/, use: ['babel-loader', 'ts-loader',],},
      {test: /example\.css$/, use: `${loader}?modules`,},
      {test: /example-camelcase\.css$/, use: `${loader}?modules&camelCase`,},
      {test: /example-namedexport\.css$/, use: `${loader}?modules&namedExport`,},
      {test: /example-camelcase-namedexport\.css$/, use: `${loader}?modules&camelCase&namedExport`,},
      {test: /example-no-css-modules\.css$/, use: loader,},
      {test: /example-compose\.css$/, use: `${loader}?modules&camelCase&namedExport`,},
    ],
  },
};
