(function(){
    //个人简历
    var blogContent = '';

    //模板
    var mb = `
## 身为一个前端，这样式是不是太丑了？

# 是的！

# 。。。。。。

# 算了，还是要找一个UI吧，嗯

# 希望大家多关注我的博客，还是喜欢原来的样式恢复一下吧

    `;

    // 第一次访问标识符
    var first = true;
    //是否是正在展示页
    var firstMd = true;
    //第一次渲染定时
    var firstXR = null;
    //动画结束追加css
    var animationEnd = null;
    //css结束追加内容
    var animationEndContent = null;
    //恢复原状定时器
    var resize = null;
    //请求博客列表
    fetch('/getbloglists', {
        method: 'get'
    }).then((response)=>{
        response.json().then((res)=>{
            //遍历第一层
            for(let i = 0;i < res.length;++i){
                document.querySelector('#MDtype').innerHTML += '<option value="'+res[i].MDs+'">'+res[i].type+'</option>';
            }
            for(let i = 0;i < res[0].MDs.length;++i){
                document.querySelector('#MDname').innerHTML = '<option value="">请选择</option>';
                document.querySelector('#MDname').innerHTML += '<option value="'+res[0].MDs[i]+'">'+res[0].MDs[i]+'</option>';
            }
            //获取简历文章
            getBlog('个人简历','自我介绍');
        })
    });

    //请求blog
    function getBlog(type,MDs){
        document.querySelector('.title').innerHTML = MDs;
        fetch('/getblog?type='+type+'&MDs='+MDs, {
            method: 'get'
        }).then((response)=>{
            response.text().then((data)=>{
                // 判断是否是是个人简历并且是否第一次打开
                if(type == '个人简历' && first){
                    first = false;
                    blogContent = data;
                    personShow(data);
                }else{
                    mdToHTML(data);
                }
                
            });
        });
    }
    //选择blog类型
    document.querySelector('#MDtype').onchange = function(){
        if(firstMd){
            firstMd = false;
            removeCss();
        }
        var val = this.value.split(',');
        document.querySelector('#MDname').innerHTML = '<option value="">请选择</option>';
        for(let i = 0;i < val.length;++i){
            document.querySelector('#MDname').innerHTML += '<option value="'+val[i]+'">'+val[i]+'</option>';
        }
    }


    //选择内容
    document.querySelector('#MDname').onchange = function(){
        if(this.value !== ''){
            var MDtype = document.querySelector('#MDtype');
            var index = MDtype.selectedIndex;
            getBlog(MDtype.options[index].text,this.value);
        }
    }

    //个人秀
    function personShow(data){
        var i = 0;
        var max = data.length;

        firstXR = setInterval(function(){
            var str=data.substring(0,(i = i + 1));
            mdToHTML(str);
            document.documentElement.scrollTop=10000;
            if(i >= max){
                clearInterval(firstXR);
                setCss();
            }
        },50);
        // setCss();
    }

    //转化
    function mdToHTML(data){
        var converter = new showdown.Converter(); //初始化转换器
        var htmlcontent  = converter.makeHtml(data); //将MarkDown转为html格式的内容
        document.querySelector('.mdparase').innerHTML = htmlcontent;
        var arrs = document.querySelectorAll('pre code');
        for(var i = 0;i < arrs.length;++i){
            hljs.highlightBlock(arrs[i]);
        }
        
    }

    //给页面加上css
    function setCss(){
        document.querySelector('.cssQy').classList.add('active');
        var sty = document.querySelector('#stynone').innerHTML;
        var i = 0;
        var max = sty.length;
        document.querySelector('.cssQy').querySelector('code').innerHTML = '';
        document.querySelector('.cssQy').querySelector('.hljs').addEventListener('transitionend',function(){
            animationEnd = setInterval(function(){
                var context = sty.substring(0,(i = i + 1))
                document.querySelector('#sty').innerHTML = context;
                document.querySelector('.cssQy').querySelector('code').innerHTML = context;
                hljs.highlightBlock(document.querySelector('.cssQy').querySelector('code'));
                if(i >= max){
                    clearInterval(animationEnd);
                    document.querySelector('.cssQy').classList.remove('active');
                    var j = blogContent.length;
                    var m = (blogContent+mb).length;
                    animationEndContent = setInterval(function(){
                        var d = (blogContent+mb).substring(0,j++);
                        mdToHTML(d);
                        document.documentElement.scrollTop=10000;
                        if(j >= m){
                            clearInterval(animationEndContent);
                            //删除页面样式
                            resize = setTimeout(function(){removeCss();},500)
                        }
                    },70);
                    

                    
                }
            },100);
        });
        
    }

    function removeCss(){
        document.querySelector('#sty').innerHTML = '';
        mdToHTML(blogContent);
        clearInterval(firstXR);
        clearInterval(animationEnd);
        clearInterval(animationEndContent);
        clearTimeout(resize);
    }
})()

