const chalk = require('chalk');
const portfinder = require('portfinder');
const setupDevServer = require('../setup-dev-server');
const config = require('../../config');

const defaults = {
  host: '0.0.0.0',
  port: 8080,
};

module.exports = (api, options) => {
  api.registerCommand('ssr:serve', {
    description: 'SSR serve start for development',
  }, async (args) => {
    // SSR SERVE flag
    process.env.VUE_CLI_SSR_SERVE = true;

    await setupDevServer(api, options);

    portfinder.basePort = args.port || process.env.PORT || options.devServer.port || defaults.port;
    const port = await portfinder.getPortPromise();
    const host = args.host || process.env.HOST || options.devServer.host || defaults.host;

    const app = require(config.entryDevApp);

    app.listen(port, host, () => {
      const networkUrl = `http://localhost:${port}`;
      // eslint-disable-next-line no-console
      console.log(`server running at ${chalk.cyan(networkUrl)}`);
    });
  });
};

module.exports.defaultModes = {
  'ssr:serve': 'development',
};
