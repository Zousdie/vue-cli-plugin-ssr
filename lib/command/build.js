const fs = require('fs-extra');
const webpack = require('webpack');
const validateWebpackConfig = require('@vue/cli-service/lib/util/validateWebpackConfig');
const formatStats = require('@vue/cli-service/lib/commands/build/formatStats');
const { log } = require('@vue/cli-shared-utils');

function build(config) {
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

      resolve(stats);
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
    if (args.clean !== false) {
      await fs.remove(api.resolve(options.outputDir));
    }

    process.env.VUE_CLI_BUILD_TARGET = 'app';
    process.env.VUE_CLI_SSR_SIDE = 'server';
    const serverConfig = api.resolveWebpackConfig();
    validateWebpackConfig(serverConfig, api, options);
    await build(serverConfig);

    process.env.VUE_CLI_SSR_SIDE = 'client';
    const clientConfig = api.resolveWebpackConfig();
    validateWebpackConfig(clientConfig, api, options);
    const stats = await build(clientConfig);

    delete process.env.VUE_CLI_BUILD_TARGET;

    log(formatStats(stats, api.service.projectOptions.outputDir, api));
  });
};

module.exports.defaultModes = {
  'ssr:build': 'production',
};
