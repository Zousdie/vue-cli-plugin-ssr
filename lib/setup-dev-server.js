const path = require('path');
const MemoryFS = require('memory-fs');
const webpack = require('webpack');
const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const validateWebpackConfig = require('@vue/cli-service/lib/util/validateWebpackConfig');
const webpackHotMiddleware = require('./hot-middleware');
const setupWebpack = require('./setup-webpack');
const HotRenderer = require('./hot-renderer');
const middleware = require('./middleware');

module.exports = (api, options) => new Promise((resolve) => {
  const IS_DEV = process.env.NODE_ENV === 'development';

  const hotRenderer = new HotRenderer();

  let serverBundle = null;
  let clientManifest = null;
  let clientPage = null;

  const onComplete = () => {
    if (serverBundle && clientManifest && clientPage) {
      hotRenderer.update(serverBundle, clientManifest, clientPage);
      resolve();
    }
  };

  // generate client config for development
  const clientConfigChain = setupWebpack(api.resolveChainableWebpackConfig(), 'client', api.service.mode);
  if (IS_DEV) {
    clientConfigChain
      .entry('app')
      .add('webpack-hot-middleware/client?noInfo=true')
      .end()
      .plugin('hmr')
      .use(webpack.HotModuleReplacementPlugin);
  }
  const clientConfig = clientConfigChain.toConfig();
  validateWebpackConfig(clientConfig, api, options);

  // generate server config for development
  const serverConfig = setupWebpack(api.resolveChainableWebpackConfig(), 'server', api.service.mode)
    .toConfig();
  validateWebpackConfig(serverConfig, api, options);

  // compiler
  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);

  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    index: false,
    noInfo: true,
    quiet: true,
    stats: 'none',
    logLevel: 'error',
  });

  // client
  clientCompiler.hooks.done.tap('vue-cli-service ssr:serve', async (stats) => {
    if (stats.hasErrors()) return;

    try {
      clientManifest = JSON.parse(
        devMiddleware
          .fileSystem
          .readFileSync(path.join(clientConfig.output.path, 'vue-ssr-client-manifest.json')),
      );

      clientPage = devMiddleware.fileSystem
        .readFileSync(path.join(clientConfig.output.path, 'index.html'), 'UTF-8');
    } catch (e) { /* */ }

    onComplete(resolve);
  });

  // server
  const mfs = new MemoryFS();
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err) => {
    if (err) throw err;

    try {
      serverBundle = JSON.parse(
        mfs.readFileSync(path.join(clientConfig.output.path, 'vue-ssr-server-bundle.json')),
      );
    } catch (e) { /* */ }

    onComplete(resolve);
  });

  // save middleware
  middleware.dev = devMiddleware;
  middleware.hmr = webpackHotMiddleware(clientCompiler, {
    heartbeat: 5000,
    log: false,
  });
  middleware.hotRenderer = hotRenderer;
});
