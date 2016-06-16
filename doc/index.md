### 基本规范
- 文件内容编码均统一为UTF-8；
- 缩进用四个空格的Tab替代空格
- 文件名应以功能或内容命名，多个单词组成时，采用中划线`-`分隔
```
service.html
tools.js
header-btn.png
```
#### CSS中的Class 和 元素ID
- class 应以功能或内容命名，不以表现形式命名；
- class 与 id 单词字母小写，多个单词组成时，采用中划线`-`分隔，不要驼峰命名法和下划线；

```html
<p id="decription" class="decriptione-paragraph"></p>
```


### HTML规范
#### 标签
* 自闭合（self-closing）标签，需闭合 ( 例如： `img` `input` `br` `hr` 等 )；
* 可选的闭合标签（closing tag），需闭合 ( 例如：`</li>` 或 `</body>` )；


### CSS规范
#### 选择器的使用
- 尽量分为三级：全站级、模块级、页面级。
- 避免选择器和 Class、ID 叠加使用；
- 将嵌套深度限制在2级。对于超过3级的嵌套，给予重新评估。这可以避免出现过于详实的CSS选择器。
- 避免大量的嵌套规则。当可读性受到影响时，将之打断。

### Javascript规范
#### 命名

常量名：全部大写并单词间用下划线分隔

```javascript
	var CSS_BTN_CLOSE = "CSS_BTN_CLOSE",
		TXT_LOADING = "TXT_LOADING";
```

对象的属性或方法名：小驼峰式（little camel-case）

```javascript
Dialog.prototype = {
    init: function () {},
    bindEvent: function () {},
    updatePosition: function () {}
    console.log("aaaa");
};
```
类名（构造器） 小驼峰式但首字母大写

```javascript
function Engine(options) {}
```
函数名：小驼峰式，使用动宾短语。

```javascript
function getStyle(element) {}
var loadingModules = function(){};
```
变量名：小驼峰式

```javascript
var loadingModules = function(){};
```
私有属性、变量和方法：小驼峰式但需要用_开头

```javascript
var _privateMethod = {};
```

### jQuery规范
#### jQuery 变量
1. 存放 jQuery 对象的变量以 `$` 开头；
2. 将 jQuery 选择器返回的对象缓存到本地变量中复用；
3. 使用驼峰命名变量；

```javascript
var $myDiv = $("#myDiv");
$myDiv.click(function(){...});
```