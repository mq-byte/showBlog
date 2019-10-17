'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/getbloglists', controller.home.getbloglists);
  router.get('/getblog', controller.home.getblog);
  app.router.redirect('/public/blog/', '/public/blog/index.html', 302);
  app.router.redirect('/favicon.ico', '/public/favicon.ico', 301);
};
