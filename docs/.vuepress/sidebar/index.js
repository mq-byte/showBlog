const js = require('./js');
const node = require('./node');
const webpack = require('./webpack');
const fragment = require('./fragment');
const pwa = require('./pwa');
module.exports = {
    ...js,
    ...node,
    ...webpack,
    ...fragment,
    ...pwa
};
