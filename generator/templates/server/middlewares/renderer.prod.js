const fs = require('fs');
const path = require('path');
const LRU = require('lru-cache');
const { createBundleRenderer } = require('vue-server-renderer');
const serverBundle = require('../../dist/vue-ssr-server-bundle.json');
const clientManifest = require('../../dist/vue-ssr-client-manifest.json');

const template = fs.readFileSync(path.resolve(__dirname, '../index.template.html'), 'utf-8');
const index = fs.readFileSync(path.resolve(__dirname, '../../dist/index.html'), 'utf-8');

const renderer = createBundleRenderer(serverBundle, {
  template,
  clientManifest,
  runInNewContext: false,
  cache: new LRU({
    max: 1000,
    maxAge: 1000 * 60 * 15,
  }),
});

module.exports = async (ctx) => {
  const context = {
    url: ctx.url,
    title: 'SSR PAGE TITLE',
    description: '',
    keywords: '',
    SSR_HEAD: '',
  };

  ctx.set('Content-Type', 'text/html');

  try {
    ctx.body = await renderer.renderToString(context);
  } catch (error) {
    ctx.body = index;
  }
};
