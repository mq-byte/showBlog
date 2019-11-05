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
    ['link', { rel: 'icon', href: '/Q.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/Q.png' }],
    ['link', { rel: 'mask-icon', href: '/Q.png', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/Q.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
}
