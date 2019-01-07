//请求博客列表
fetch('/getbloglists', {
    method: 'get'
}).then((response)=>{
    response.json().then((res)=>{
        //初始化文章
        getBlog(res[0].type,res[0].MDs[0]);

        for(let i = 0;i < res.length;++i){
            document.querySelector('#MDtype').innerHTML += '<option value="'+res[i].MDs+'">'+res[i].type+'</option>';
        }
        for(let i = 0;i < res[0].MDs.length;++i){
            document.querySelector('#MDname').innerHTML = '<option value="">请选择</option>';
            document.querySelector('#MDname').innerHTML += '<option value="'+res[0].MDs[i]+'">'+res[0].MDs[i]+'</option>';
        }
        document.querySelector('#MDname').value = res[0].MDs[0];
    })
});
//请求blog
function getBlog(type,MDs){
    document.querySelector('.title').innerHTML = MDs;
    fetch('/getblog?type='+type+'&MDs='+MDs, {
        method: 'get'
    }).then((response)=>{
        response.text().then((data)=>{
            // console.log(data);
            var converter = new showdown.Converter(); //初始化转换器
            var htmlcontent  = converter.makeHtml(data); //将MarkDown转为html格式的内容
            document.querySelector('.mdparase').innerHTML = htmlcontent;
            var arrs = document.querySelectorAll('pre code');
            for(var i = 0;i < arrs.length;++i){
                hljs.highlightBlock(arrs[i]);
            }
           
        });
      
    });
}
//选择blog类型
document.querySelector('#MDtype').onchange = function(){
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