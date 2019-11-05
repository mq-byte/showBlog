const sidebar = require('./sidebar');

module.exports = {
  title: 'QLQ学习平台',
  description: 'QLQ学习平台',
  dest:'./app/public/blog',
  base:'/public/blog/',
  themeConfig: {
    sidebarDepth: 2,
    sidebar,
    nav: [
      { text: 'javaScript', link: '/js/regexp' },
      { text: 'webpack', link: '/webpack/base-config' },
      { text: 'node', link: '/node/nodemon' },
      { text: 'js框架', link: '/fragment/angular' },
      { text: 'pwa', link: '/pwa/PWA' }
    ]
  }
}
