const js = require('./js');
const node = require('./node');
const webpack = require('./webpack');
module.exports = {
    ...js,
    ...node,
    ...webpack
};
