# 游戏后台
----

## 项目结构
```js
--components
	--common (公共模块,无业务逻辑)
		--ajax
			ajax.js
		--dialog
			--img
			index.js
			index.tmpl
			index.scss
		--class
		--event
	--widget (ui组件, 带业务逻辑)
		--filter
			index.js
			index.tmpl
	--page (路由指向各页面，各个页面)
		--union
			--union-list(工会查询)
				union-list.tmpl
				union-list.js
	--lib (第三方库)
--doc (markdown)
--output (编译产出)
--views (页面入口)
	--union
		index.vm
		router.js  // 页面路由
okay-conf.js
router.conf (api及模板变量路由)
```