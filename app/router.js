'use strict';

/**
 * @param {Egg.Application} app - egg application
 */


module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/getbloglists', controller.home.getbloglists);
  router.get('/getblog', controller.home.getblog);
  router.post('/login', controller.login.index);
  router.redirect('/public/blog/', '/public/blog/index.html', 302);
  router.redirect('/favicon.ico', '/public/favicon.ico', 301);
};
