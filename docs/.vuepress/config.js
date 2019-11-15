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
      { text: 'css', link: '/css/bfc' },
      { text: 'webpack', link: '/webpack/base-config' },
      { text: 'node', link: '/node/buffer' },
      { text: 'js框架', link: '/fragment/angular' },
      { text: 'pwa', link: '/pwa/PWA' }
    ]
  },
  plugins: {
    '@vuepress/pwa': {
        serviceWorker: true,
        updatePopup: {
          message: "New content is available.",
          buttonText: "Refresh"
        }
    }
  },
  head: [
    ['link', { rel: 'manifest', href: '/manifest.json' }]
  ],
}
