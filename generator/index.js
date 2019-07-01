module.exports = (api) => {
  if (!api.hasPlugin('router')) {
    throw new Error('Please install router plugin with \'vue add router\'.');
  }

  api.extendPackage({
    scripts: {
      'ssr:serve': 'vue-cli-service ssr:serve',
      'ssr:build': 'vue-cli-service ssr:build',
    },
    dependencies: {
      'vue-server-renderer': '^2.6.0',
      koa: '^2.7.0',
      'koa-mount': '^4.0.0',
      'koa-static': '^5.0.0',
      'lru-cache': '^5.1.1',
    },
  });

  api.render('./template');
};
