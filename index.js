const setupWebpack = require('./lib/setup-webpack');
const defaultConfig = require('./config');

module.exports = (api, options) => {
  Object.assign(defaultConfig, options.pluginOptions && options.pluginOptions.ssr);

  api.chainWebpack((config) => {
    setupWebpack(config, process.env.VUE_CLI_SSR_SIDE, api.service.mode);
  });

  require('./lib/command/serve')(api, options);
  require('./lib/command/build')(api, options);
};

module.exports.defaultModes = {
  ...require('./lib/command/serve').defaultModes,
  ...require('./lib/command/build').defaultModes,
};
