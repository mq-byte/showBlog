const js = require('./js');
const node = require('./node');
const webpack = require('./webpack');
const fragment = require('./fragment');
module.exports = {
    ...js,
    ...node,
    ...webpack,
    ...fragment
};
