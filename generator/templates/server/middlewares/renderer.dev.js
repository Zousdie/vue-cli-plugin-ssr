const fs = require('fs');
const path = require('path');
const LRU = require('lru-cache');
const { createBundleRenderer } = require('vue-server-renderer');
const SSRMiddleware = require('@zousdie/vue-cli-plugin-ssr/lib/middleware');

const template = fs.readFileSync(path.resolve(__dirname, '../index.template.html'), 'utf-8');

let renderer = null;

SSRMiddleware.hotRenderer.addListener((serverBundle, clientManifest) => {
  renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest,
    runInNewContext: false,
    cache: new LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15,
    }),
  });
});

module.exports = async (ctx) => {
  const context = {
    title: 'SSR PAGE TITLE',
    description: '',
    keywords: '',
    SSR_HEAD: '',
    url: ctx.url,
  };

  try {
    ctx.set('Content-Type', 'text/html');
    ctx.body = await renderer.renderToString(context);
  } catch (error) {
    ctx.throw(500, error.message, error);
  }
};
