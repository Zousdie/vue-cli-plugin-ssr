const defaultTitle = 'VUE SSR PROJECT';

export default function (router, context) {
  router.afterEach((to) => {
    if (context && to.meta) {
      const { title, description, keywords } = to.meta;

      context.title = title;
      context.description = description;
      context.keywords = keywords;
    }

    if (!context && to.meta) {
      const { title, description, keywords } = to.meta;

      document.title = title || defaultTitle;

      if (description) {
        let meta = document.querySelector("meta[name='description']");

        if (meta) {
          meta.setAttribute('content', description);
          return;
        }

        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        meta.setAttribute('content', description);

        document.head.appendChild(meta);
      }

      if (keywords) {
        let meta = document.querySelector("meta[name='keywords']");

        if (meta) {
          meta.setAttribute('content', keywords);
          return;
        }

        meta = document.createElement('meta');
        meta.setAttribute('name', 'keywords');
        meta.setAttribute('content', keywords);

        document.head.appendChild(meta);
      }
    }
  });

  return router;
}
