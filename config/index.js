const path = require('path');

const base = process.cwd();

module.exports = {
  entryClient: path.resolve(base, './src/entry-client.js'),
  entryServer: path.resolve(base, './src/entry-server.js'),
  entryDevApp: path.resolve(base, './server/app.dev'),
  nodeExternalsWhitelist: [/\.css$/, /\?vue&type=style/],
  chainWebpackCallback: null,
};
