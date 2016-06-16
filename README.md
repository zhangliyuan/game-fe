# 教师空间
----

## 项目结构
```js
--components
	--common (公共模块)
		--submit
			index.js
		--dialog
			--img
			index.js
			index.tmpl
			index.scss
		--class
		--event
	--widget (ui组件)
		--filter
			index.js
			index.tmpl
		--question-list
			index.js
			index.html
	--page (路由指向各页面)
		--quizcenter
			--chapter
				index.html
				index.js
			--knowledge
				index.html
				index.js
	--lib (第三方库)
--doc (markdown)
--output (编译产出)
--views (实体页面)
	--quizcenter
		index.vm
		router.js
okay-conf.js
router.conf (api及模板变量路由)
```