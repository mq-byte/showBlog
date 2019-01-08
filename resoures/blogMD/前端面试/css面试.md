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
    content: "";
    /* 两边不可出现浮动元素 */
    clear: both;
    display:block;
}
.clearfix {
    /* 兼容IE */
    zoom: 1;
}

```

## 5. 伪元素，伪类？
伪元素：::after,::before,::first-line,::first-letter,::selection ......  
伪类：:hover,:link,:active ......

## 6. 选择器？
.....

## 7. containing block计算方式？
[点击这里](http://www.cnblogs.com/fsjohnhuang/p/5295859.html)

## 8. display:none与visibility：hidden的区别？

## 9. 浏览器是怎样解析CSS选择器的？
CSS选择器的解析是从右向左解析的。若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。

## 10. 元素竖向的百分比设定是相对于容器的高度吗？
宽度

## 11. css绘制一个自适应的正方形？
方法都是利用问题10

## 12. 用纯CSS创建一个三角形的原理是什么？

## 13. CSS3有哪些新特性？

1. RGBA和透明度

2. background-image background-origin3. 333(content-box/padding-box/border-box) background-size background-repeat

3. word-wrap（对长的不可分割单词换行）word-wrap：break-word

4. 文字阴影：text-shadow： 5px 5px 5px #FF0000;（水平阴影，垂直阴影，模糊距离，阴影颜色）

5. font-face属性：定义自己的字体

6. 圆角（边框半径）：border-radius 属性用于创建圆角

7. 边框图片：border-image: url(border.png) 30 30 round

8. 盒阴影：box-shadow: 10px 10px 5px #888888

9. 媒体查询：定义两套css，当浏览器的尺寸变化时会采用不同的属性


... ...

## 14. 以上问题下的答案都是考点！

## 15. font-face怎么用？
```css
 @font-face {
      font-family: <YourWebFontName>;
      src: <source> [<format>][,<source> [<format>]]*;
      [font-weight: <weight>];
      [font-style: <style>];
    }
/* 1、YourWebFontName:此值指的就是你自定义的字体名称，最好是使用你下载的默认字体，他将被引用到你的Web元素中的font-family。如“font-family:"YourWebFontName";”

2、source:此值指的是你自定义的字体的存放路径，可以是相对路径也可以是绝路径；

3、format：此值指的是你自定义的字体的格式，主要用来帮助浏览器识别，其值主要有以下几种类型：truetype,opentype,truetype-aat,embedded-opentype,avg等；

4、weight和style:这两个值大家一定很熟悉，weight定义字体是否为粗体，style主要定义字体样式，如斜体。 */

```