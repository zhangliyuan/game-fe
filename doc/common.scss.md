## common.scss方法(宏)

#### fis-clearfix
    * description： 清除浮动(不需要添加额外标签)
    * param      ： 
    * ex         ： @include fis-clearfix
    
#### fis-float
    * description： 浮动(解决IE6 double margin问题)
    * param      ： 浮动方向,默认left
    * ex         ： @include fis-float(right)
#### fis-float-left
    * description： 左浮动
    * param      ： 
    * ex         ： @include fis-float-left
#### fis-float-right
    * description： 右浮动
    * param      ： 
    * ex         ： @include fis-float-right
#### fis-inline-block
    * description： inline-block展示(兼容inline和block元素)
    * param      ： 
    * ex         ： @include fis-inline-block
#### fis-border-radius
    * description： 圆角(support IE9+、Firefox 3.5+、Safari、Chrome、Opera)
    * param      ： 圆角半径,默认5px
    * ex         ： @include fis-border-radius(3px)
#### fis-box-shadow
    * description： 阴影(support Firefox 3.5+、Safari、Chrome、Opera)
    * param      ： 阴影参数(水平偏移值 | 垂直偏移值 | 阴影模糊值 | 阴影颜色)
    * ex         ： @include fis-box-shadow(3px 2px 2px #666)
#### fis-gradient-vertical
    * description： 背景垂直渐变(support IE8+、Firefox 3.5+、Safari、Chrome、Opera)
    * param      ： 颜色渐变初始值,默认 #555
    * param      ： 颜色渐变终值,默认 #333
    * ex         ： @include fis-gradient-vertical(#fff,#666)
#### fis-transition
    * description： css3动画
    * param      ： 动画属性，默认 0.4s
    * ex         ： @include fis-transition(3s)
#### fis-opacity
    * description： 透明度(support IE6+、Firefox 3.5+、Safari、Chrome、Opera)
    * param      ： 透明度值,默认100
    * ex         ： @include fis-opacity(50)
#### fis-nowrap
    * description： 文本不折行
    * param      ： 
    * ex         ： @include fis-nowrap
#### fis-min-height
    * description： 最小高度
    * param      ： 最小高度值
    * ex         ： @include fis-min-height(200px)
#### fis-min-width
    * description： 最小宽度
    * param      ： 最小宽度值
    * ex         ： @include fis-min-width(200px)
#### fis-icon
    * description： 方形的icon
    * param      ： 边长,默认16px
    * ex         ： @include fis-icon(36px)
#### fis-icon-rect
    * description： 长方形的icon
    * param      ： 宽度，默认16px
    * param      ： 高度，默认16px
    * ex         ： @include fis-icon-rect(16px ,18px)
#### fis-arrow
    * description： 箭头
    * param      ： 颜色，默认＃999
    * param      ： 边框宽度，默认0 4px 4px 4px 
    * param      ： 背景颜色，默认 transparent transparent #999 transparent
    * ex         ： @include fis-arrow
#### fis-rotate
    * description： 旋转，支持ie
    * param      ： 标准浏览器的角度，默认180deg
    * param      ： ie兼容性视图角度 1=90度 2=180度等,默认2
    * ex         ： @include fis-rotate(188deg)
#### fis-rotate-y
    * description： 线性反转（慢－快－慢）
    * param      ： 反转所需时间,默认7秒
    * ex         ： @include fis-rotate-y(4s)
#### fis-rotate
    * description： 旋转（慢－快－慢）
    * param      ： 旋转所需时间,默认4秒
    * ex         ： @include fis-rotate(7s)