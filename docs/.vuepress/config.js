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
      { text: 'webpack', link: '/webpack/base-config' },
      { text: 'node', link: '/node/nodemon' },
      { text: 'javaScript', link: '/js/a' }
    ]
  }
}
