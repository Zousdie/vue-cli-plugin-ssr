const Koa = require('koa');
const SSRMiddleware = require('@zousdie/vue-cli-plugin-ssr/lib/middleware');
const rendererMiddleware = require('./middlewares/renderer.dev.js');

const app = new Koa();

app.use(SSRMiddleware.dev);
app.use(SSRMiddleware.hmr);
app.use(rendererMiddleware);

module.exports = app;
