'use strict';

const Controller = require('egg').Controller;
const pathOb = require('path');
const ReadMD = require('../utils/readMD');
const fsOb = require('fs');

class HomeController extends Controller {

  async index() {
    this.ctx.response.redirect('/public/showblog/index.html');
  }

  async getbloglists() {
    let ob = {};
    let files = await this.readList();
    let fMDs = await this.readListMD(files);
    this.ctx.response.body = fMDs;
  }

  async getblog(){
    let data = await new Promise((resove)=>{
      fsOb.readFile(pathOb.join(__dirname,'../../resoures/blogMD/'+this.ctx.request.query.type+'/'+this.ctx.request.query.MDs+'.md'),(err,data)=>{
        resove(data);
      });
    });
    this.ctx.response.body = data;
  }

  async readList(){
    return await new Promise(function(resove,reject){
        ReadMD.readList(pathOb.join(__dirname,'../../resoures/blogMD'),(err,files)=>{
          resove(files);
        });
    });
  }

  async readListMD(files){
    var ps = [];
    
    for(let i = 0;i < files.length;++i){
      ps.push(new Promise((resove)=>{
        ReadMD.readList(pathOb.join(__dirname,'../../resoures/blogMD/')+files[i],(err,data)=>{
          let readListMDName = {
            type:'',
            MDs:''
          };
          for(let i = 0;i < data.length;++i){
            data[i] = data[i].replace(/.md/g,'');
          }
          readListMDName.type = files[i];
          readListMDName.MDs = data;
          resove(readListMDName);
        });
      }));
    }
    return await Promise.all(ps);
  }
}

module.exports = HomeController;
