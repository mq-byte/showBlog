(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{249:function(l,t,i){"use strict";i.r(t);var a=i(3),v=Object(a.a)({},(function(){var l=this,t=l.$createElement,i=l._self._c||t;return i("ContentSlotsDistributor",{attrs:{"slot-key":l.$parent.slotKey}},[i("h1",{attrs:{id:"bfc"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#bfc"}},[l._v("#")]),l._v(" BFC")]),l._v(" "),i("p",[l._v("块级格式化上下文，通俗的意思就是内部元素不会影响到外部元素。")]),l._v(" "),i("h2",{attrs:{id:"产生bfc的条件"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#产生bfc的条件"}},[l._v("#")]),l._v(" 产生BFC的条件")]),l._v(" "),i("ul",[i("li",[l._v("根元素(<html>)")]),l._v(" "),i("li",[l._v("浮动元素（元素的 float 不是 none）")]),l._v(" "),i("li",[l._v("绝对定位元素（元素的 position 为 absolute 或 fixed）")]),l._v(" "),i("li",[l._v("行内块元素（元素的 display 为 inline-block）")]),l._v(" "),i("li",[l._v("表格单元格（元素的 display为 table-cell，HTML表格单元格默认为该值）")]),l._v(" "),i("li",[l._v("表格标题（元素的 display 为 table-caption，HTML表格标题默认为该值）")]),l._v(" "),i("li",[l._v("匿名表格单元格元素（元素的 display为 table、table-row、 table-row-group、table-header-group、table-footer-group（分别HTML table、row、tbody、thead、tfoot的默认属性）或 inline-table）")]),l._v(" "),i("li",[l._v("overflow 值不为 visible 的块元素")]),l._v(" "),i("li",[l._v("display 值为 flow-root 的元素")]),l._v(" "),i("li",[l._v("contain 值为 layout、content或 paint 的元素")]),l._v(" "),i("li",[l._v("弹性元素（display为 flex 或 inline-flex元素的直接子元素）")]),l._v(" "),i("li",[l._v("网格元素（display为 grid 或 inline-grid 元素的直接子元素）")]),l._v(" "),i("li",[l._v("多列容器（元素的 column-count 或 column-width 不为 auto，包括 column-count 为 1）")]),l._v(" "),i("li",[l._v("column-span 为 all 的元素始终会创建一个新的BFC，即使该元素没有包裹在一个多列容器中（标准变更，Chrome bug）。")])]),l._v(" "),i("h2",{attrs:{id:"bfc现象"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#bfc现象"}},[l._v("#")]),l._v(" BFC现象")]),l._v(" "),i("ol",[i("li",[l._v("内部的Box会在垂直方向上一个接一个的放置。")]),l._v(" "),i("li",[l._v("同一个BFC的两个相邻Box的margin会发生重叠。")]),l._v(" "),i("li",[l._v("每个元素的左外边距与包含块的左边界相接触（从左向右），即使浮动元素也是如此。（这说明BFC中子元素不会超出他的包含块，而position为absolute的元素可以超出他的包含块边界（我理解的是这是一个特列！））")]),l._v(" "),i("li",[l._v("BFC的区域不会与float的元素区域重叠")]),l._v(" "),i("li",[l._v("计算BFC的高度时，浮动子元素也参与计算")]),l._v(" "),i("li",[l._v("BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素")])]),l._v(" "),i("h2",{attrs:{id:"bfc作用"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#bfc作用"}},[l._v("#")]),l._v(" BFC作用")]),l._v(" "),i("ol",[i("li",[l._v("解决margin重叠：利用现象6")]),l._v(" "),i("li",[l._v("清除浮动：利用现象5")]),l._v(" "),i("li",[l._v("多列布局：利用现象4")])])])}),[],!1,null,null,null);t.default=v.exports}}]);