const defaultMeta = {
  title: 'VUE SSR PROJECT',
  description: 'VUE SSR',
  keywords: 'VUE SSR',
}

export default function (router, context) {
  router.afterEach((to) => {
    if (to.mate) {
      const { title, description, keywords } = Object.assign({}, defaultMeta, to.meta);

      if (context) {
        // Server side
        context.title = title;
        context.description = description;
        context.keywords = keywords;

      } else {
        // Client side
        document.title = title;

        if (description) {
          let meta = document.querySelector("meta[name='description']");

          if (meta) {
            meta.setAttribute('content', description);
          } else {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'description');
            meta.setAttribute('content', description);
            document.head.appendChild(meta);
          }
        }

        if (keywords) {
          let meta = document.querySelector("meta[name='keywords']");

          if (meta) {
            meta.setAttribute('content', keywords);
          } else {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'keywords');
            meta.setAttribute('content', keywords);
            document.head.appendChild(meta);
          }
        }
      }
    }
  });

  return router;
}
