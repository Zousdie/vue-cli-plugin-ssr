import createApp from './main';

export default context => new Promise((resolve, reject) => {
  const { app, router, store } = createApp(context);

  router.push(context.url);

  router.onReady(() => {
    context.rendered = () => {
      context.state = store.state;
    };
    resolve(app);
  }, reject);
});
