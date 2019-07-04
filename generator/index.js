const fs = require('fs-extra');
const chalk = require('chalk');

function delFile(api, path) {
  const filePath = api.resolve(path);
  if (fs.existsSync(filePath)) {
    api.exitLog(chalk.red(`SSR plugin will delete file "${path}"`), 'warn');
    fs.removeSync(filePath);
  }
}

function moveFile(api, path, tarPath) {
  const filePath = api.resolve(path);
  const tarFilePath = api.resolve(tarPath);
  if (fs.existsSync(filePath)) {
    api.exitLog(chalk.red(`SSR plugin will move file "${path}" to "${tarPath}"`), 'warn');
    fs.renameSync(filePath, tarFilePath);
  }
}

module.exports = (api) => {
  if (!api.hasPlugin('router')) {
    throw new Error('Please install router plugin with \'vue add router\'.');
  }

  if (!api.hasPlugin('vuex')) {
    throw new Error('Please install vuex plugin with \'vue add vuex\'.');
  }

  api.extendPackage({
    scripts: {
      'ssr:serve': 'vue-cli-service ssr:serve',
      'ssr:build': 'vue-cli-service ssr:build',
      'ssr:start': 'node server/app.prod.js',
    },
    dependencies: {
      koa: '^2.7.0',
      'koa-mount': '^4.0.0',
      'koa-static': '^5.0.0',
      'lru-cache': '^5.1.1',
      'vue-server-renderer': '^2.6.0',
    },
  });

  api.render('./templates');

  api.onCreateComplete(() => {
    if (api.hasPlugin('eslint')) {
      require('@vue/cli-plugin-eslint/lint')({ silent: true }, api);
    }

    delFile(api, './src/router.js');
    delFile(api, './src/store.js');
    moveFile(api, './public/favicon.ico', './public/assets/favicon.ico');

    api.exitLog(`Start dev server with ${chalk.cyan('npm run ssr:serve')}`, 'info');
    api.exitLog(`Build with ${chalk.cyan('npm run ssr:build')}`, 'info');
    api.exitLog(`Run in production with ${chalk.cyan('npm run ssr:build')}`, 'info');
    api.exitLog(chalk.yellow('Please set "assetsDir" to "assets" in "vue.config.js"'), 'info');
  });
};
