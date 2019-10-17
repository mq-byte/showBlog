console.log(process.cwd());

module.exports = {
  title: 'QLQ学习平台',
  description: 'QLQ学习平台',
  dest:'./app/public/blog',
  base:'/public/blog/',
  themeConfig: {
    sidebarDepth: 2,
    sidebar:{
      '/js/':[
        {
          title: 'javaScript',
          collapsable: false,
          children: [
            'a'
          ]
        }
      ],
      '/':[
        {
          title: 'HOME',
          collapsable: false,
          children: [
            ''
          ]
        }
      ]
    },
    nav: [
      { text: 'javaScript', link: '/js/a' },
      { text: 'home', link: '/' }
    ]
  }
}
