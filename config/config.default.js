'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1545037800205_8083';

  // add your config here
  config.middleware = [];

  config.cluster = {
    listen: {
      path: '',
      port: 8080,
      hostname: '0.0.0.0',
    }
  };

  config.siteFile = {
    '/favicon.ico': '/public/favicon.ico',
  };

  config.security = {
    csrf: {
      queryName: '_csrf', // 通过 query 传递 CSRF token 的默认字段为 _csrf
      bodyName: '_csrf', // 通过 body 传递 CSRF token 的默认字段为 _csrf
    }
  }

  return config;
};
