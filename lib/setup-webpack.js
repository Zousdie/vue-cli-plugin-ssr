const WebpackBar = require('webpackbar');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const defaultConfig = require('../config');

module.exports = (
  config,
  SSR_SIDE = process.env.VUE_CLI_SSR_SIDE,
  MODE = process.env.NODE_ENV,
) => {
  config
    .entry('app')
    .clear()
    .add(defaultConfig.entryClient)
    .end();

  if (!['server', 'client'].includes(SSR_SIDE)) return config;

  const IS_PROD = MODE === 'production';
  const IS_SSR_SERVER = SSR_SIDE === 'server';

  // webpack entry and target
  config
    .entry('app')
    .clear()
    .add(IS_SSR_SERVER ? defaultConfig.entryServer : defaultConfig.entryClient)
    .end()
    .target(IS_SSR_SERVER ? 'node' : 'web');

  // loader
  config
    .module
    .rule('vue')
    .use('vue-loader')
    .tap((options) => {
      if (IS_SSR_SERVER) {
        options.cacheIdentifier += '-server';
        options.cacheDirectory += '-server';
      }
      options.optimizeSSR = IS_SSR_SERVER;
      options.extractCSS = IS_PROD;

      return options;
    })
    .end()
    .use('cache-loader')
    .tap((options) => {
      if (IS_SSR_SERVER) {
        options.cacheIdentifier += '-server';
        options.cacheDirectory += '-server';
      }
      return options;
    });

  // plugin
  config
    .plugin('vue-ssr')
    .use(IS_SSR_SERVER ? VueSSRServerPlugin : VueSSRClientPlugin)
    .end()
    .plugin('loader')
    .use(WebpackBar, [{
      name: IS_SSR_SERVER ? 'Build server' : 'Build client',
      color: IS_SSR_SERVER ? 'blue' : 'green',
    }])
    .end()
    .plugins
    .delete('hmr')
    .delete('preload')
    .delete('prefetch')
    .delete('progress');

  if (IS_PROD && !IS_SSR_SERVER) {
    // disable source-map on production mode
    // fix ssr bug: https://github.com/vuejs/vue/issues/9488
    config.devtool(undefined);
  }

  if (IS_SSR_SERVER) {
    config
      .plugins
      .delete('friendly-errors')
      .end()
      .devtool('source-map')
      .node
      .clear()
      .end()
      .output
      .libraryTarget('commonjs2')
      .end()
      .externals(nodeExternals({ whitelist: defaultConfig.nodeExternalsWhitelist }))
      .optimization
      .splitChunks(false)
      .runtimeChunk(false);

    // disable inline style: https://github.com/vuejs/vue-ssr-docs/issues/196
    if (config.plugins.has('extract-css')) {
      const langs = ['css', 'postcss', 'scss', 'sass', 'less', 'stylus'];
      const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];

      langs.forEach((lang) => {
        types.forEach((type) => {
          const rule = config.module.rule(lang).oneOf(type);
          rule
            .use('vue-style')
            .loader('css-loader/locals')
            .before('css-loader');
          rule.uses.delete('css-loader');
          rule.uses.delete('extract-css-loader');
        });
      });

      config.plugins.delete('extract-css');
    }
  }

  return config;
};
