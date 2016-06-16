/**
 * Created by zh.l.y on 2016/6/16.
 */

var $=require('/components/common/base/base.js');
var ec = require('components/common/event/event.js');


var WINDOW_TPL={
    LAYOUT:__inline('/views/layout/layout.html')
};

// 页面信息
var app_name="tester";


/**
 * 页面操作 不对外暴露
 */
var View={
    winLayout:function(){
        $('body').html(WINDOW_TPL.LAYOUT);
    }
};


module.exports=function(){
    View.winLayout({});
    var router = new Router()
    .before(function(req,next){
        // 关闭所有弹窗
        ec.fire('dialog.close');
        // 释放资源
        ec.fire('page.unload');
        ec.off('page.unload');
        next();
    })
    // 作业按学生批改作业
    // 按学生查看修改为按学生批改2016-03-21
    .addRoute('#/111', function(req, next){
        console.log('111');
        // 组件初始化参数
        require.async(['components/page/union/union.js'],function(page){
            // 组件初始化参数
            page.init();
        });
    })
    .addRoute('#/222', function(req, next){

        console.log('222');
        // 组件初始化参数
        require.async(['./222.js'],function(page){
            // 组件初始化参数
            page.init();
        });
    })

    // 404Error
    .errors(404, function( err, href){
        console.log('Page not found!' + href );
    });

    // 默认跳转
    if(!location.hash){
        router.redirect('#/222');
    }else{
        router._onHashChange();
    }
};