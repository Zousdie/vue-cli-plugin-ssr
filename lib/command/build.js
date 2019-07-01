const fs = require('fs-extra');
const webpack = require('webpack');
const formatStats = require('@vue/cli-service/lib/commands/build/formatStats');
const { log } = require('@vue/cli-shared-utils');
const setupWebpack = require('../setup-webpack');

function build(config, api) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      if (stats.hasErrors()) {
        reject(new Error('Build failed with errors.'));
        return;
      }

      log(formatStats(stats, api.service.projectOptions.outputDir, api));

      resolve();
    });
  });
}

module.exports = (api, options) => {
  api.registerCommand('ssr:build', {
    description: 'SSR build for production',
    usage: 'vue-cli-service ssr:build [options]',
    options: {
      '--mode': 'specify env mode (default: production)',
      '--no-clean': 'do not remove the dist directory before building the project',
    },
  }, async (args) => {
    const clientConfig = api.resolveChainableWebpackConfig();
    const serverConfig = api.resolveChainableWebpackConfig();
    setupWebpack(clientConfig, 'client', api.service.mode);
    setupWebpack(serverConfig, 'server', api.service.mode);

    if (args.clean !== false) {
      await fs.remove(api.resolve(options.outputDir));
    }

    await build([clientConfig.toConfig(), serverConfig.toConfig()], api);
  });
};

module.exports.defaultModes = {
  'ssr:build': 'production',
};
