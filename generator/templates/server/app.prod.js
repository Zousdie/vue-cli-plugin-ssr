const Koa = require('koa');
const koaMount = require('koa-mount');
const koaStatic = require('koa-static');
const rendererMiddleware = require('./middlewares/renderer.prod');

const app = new Koa();

app.use(koaMount('/assets', koaStatic('./dist/assets')));
app.use(rendererMiddleware);

app.listen(3000, 'localhost');
