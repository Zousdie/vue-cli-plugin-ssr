const webpackHotMiddleware = require('webpack-hot-middleware');

module.exports = (compiler, option) => {
  const expressHotMiddleware = webpackHotMiddleware(compiler, option);

  return (ctx, next) => new Promise((resolve) => {
    expressHotMiddleware(ctx.req, ctx.res, resolve);
  }).then(next);
};
