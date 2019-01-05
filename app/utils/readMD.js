var fsOb = require('fs');

module.exports = {
    readList:function(dir,cb){
        fsOb.readdir(dir,function(err,files){
            cb(err,files);
        });
    }
};