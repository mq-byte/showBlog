'use strict';

const Controller = require('egg').Controller;


class LoginController extends Controller {

    async index() {
        const { username,password } = this.ctx.request.body;
        if(username === 'pangpangjun' && password === '@0314qwer'){
            this.ctx.session.userId = username+'qwer'+password;
            this.ctx.response.redirect('/public/editblog/index.html');
        }else {
            this.ctx.response.redirect('/public/login.html');
        }
    }

    async userAuth(){
        console.log('weqrwerwer');
    }

}

module.exports = LoginController;
