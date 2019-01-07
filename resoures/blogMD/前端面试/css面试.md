## 1.解释css盒模型
标准盒模型：盒子宽度 = width+padding+border  
怪异盒模型：盒子宽度 = width

## 2.box-sizing作用？
默认值content-box  
context-box:标准盒模型  
border-box:怪异盒模型


## 3.css reset作用？
解决浏览器对相同标签解析样式不一致问题  
统一全局样式  

## 4.大致说下对BFC理解？
BFC如何生成？有什么现象？有什么作用？[点击这里](https://www.cnblogs.com/dojo-lzz/p/3999013.html)  
### 生成BFC？
1. 根元素  
2. float的值不为none  
3. overflow的值不为visible  
4. display的值为inline-block、table-cell、table-caption  
5. position的值为absolute或fixed  

### BFC现象？
1. 内部的Box会在垂直方向上一个接一个的放置。
2. 同一个BFC的两个相邻Box的margin会发生重叠。
3. 每个元素的左外边距与包含块的左边界相接触（从左向右），即使浮动元素也是如此。（这说明BFC中子元素不会超出他的包含块，而position为absolute的元素可以超出他的包含块边界（我理解的是这是一个特列！））
4. BFC的区域不会与float的元素区域重叠
5. 计算BFC的高度时，浮动子元素也参与计算
6. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素

### BFC作用？
1. 解决margin重叠：利用现象6
2. 清除浮动：利用现象5
3. 多列布局：利用现象4
```html
<div class="left"></div>
<div class="center"></div>
<div class="right"></div>
```
```css
.left{
    float:left;
}
.center{
    overflow:over;
}
.right{
    float:right;
}
```

## 4.清除浮动？
1. 利用BFC：父盒子加浮动，父盒子设置overflow:hidden;
2. 利用clearboth:伪元素，双伪元素

```css
.clearfix::after {
    /* 必须设置内容才能起到作用 */
    content: ".";
    /* 两边不可出现浮动元素 */
    clear: both;
    /* 隐藏content元素内容 */
    overflow: hidden;
    /* 隐藏content元素内容 */
    height: 0;
}
.clearfix {
    /* 兼容IE */
    zoom: 1;
}

```

