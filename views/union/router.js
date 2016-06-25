/**
 * Created by zh.l.y on 2016/6/16.
 */

var $=require('/components/common/base/base.js');
var ec = require('components/common/event/event.js');


var WINDOW_TPL={
    LAYOUT:__inline('/components/page/layout/layout.tmpl'),
    LEFT_NAV:__inline('/components/page/nav/nav.tmpl')
};

// 页面信息
var app_name="tester";


/**
 * 页面操作 不对外暴露
 */
var View={
    winLayout:function(){

        require('/components/page/nav/nav.js');
        $('body').html(WINDOW_TPL.LAYOUT(
            {
                leftNav:View.winLeftNav({})
            }
        ));
    },
    winLeftNav: function(data){
        return WINDOW_TPL.LEFT_NAV(data);
    },
    winEmptyMainContent: function(){
        $('.admin-content').empty();
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

            $('.admin-content').empty();
            next();
        })
        // 作业按学生批改作业
        // 按学生查看修改为按学生批改2016-03-21
        .addRoute('#/index', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/index/index.js'],function(Page){
                // 组件初始化参数
                var page = new Page({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/order/list', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/order/list/list.js'],function(Page){
                // 组件初始化参数
                var page = new Page({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/order/addProducts', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/order/addProducts/add.js'],function(Page){
                // 组件初始化参数
                var page = new Page({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/package/records', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/package/records/list.js'],function(Page){
                // 组件初始化参数
                var page = new Page({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/package/list', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/package/list/list.js'],function(Page){
                // 组件初始化参数
                var page = new Page({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/package/add', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/package/addPackage/add.js'],function(Page){
                // 组件初始化参数
                var page = new Page({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/union/list', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/union/union-list/union-list.js'],function(Union){
                // 组件初始化参数
                var page = new Union({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/union/check', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/union/union-check/union-check.js'],function(UnionCheck){
                // 组件初始化参数
                var page = new UnionCheck({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/union/rebat', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/union/union-rebate/union-rebate.js'],function(UnionRebate){
                // 组件初始化参数
                var page = new UnionRebate({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/customer/list', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/customer/list/list.js'],function(Page){
                // 组件初始化参数
                var page = new Page({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/customer_service/list', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/customer-service/list/list.js'],function(Page){
                // 组件初始化参数
                var page = new Page({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/customer_service/add', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/customer-service/add/add.js'],function(Page){
                // 组件初始化参数
                var page = new Page({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/index_video/list', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/booth/list.js'],function(Page){
                // 组件初始化参数
                var page = new Page({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/tools/email', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/tools/email/add.js'],function(Page){
                // 组件初始化参数
                var page = new Page({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/tools/sms', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/tools/sms/add.js'],function(Page){
                // 组件初始化参数
                var page = new Page({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/setting/logs', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/settings/logs/list.js'],function(Page){
                // 组件初始化参数
                var page = new Page({
                    container:'.admin-content'
                });
                //page.init();
            });
        })
        .addRoute('#/setting/account', function(req, next){
            console.log(req);
            // 组件初始化参数
            require.async(['components/page/settings/account/list.js'],function(Page){
                // 组件初始化参数
                var page = new Page({
                    container:'.admin-content'
                });
                //page.init();
            });
        })

        // 404Error
        .errors(404, function( err, href){
            console.log('Page not found!' + href );
        });

    // 默认跳转
    if(!location.hash){
        router.redirect('#/union/list');
    }else{
        router._onHashChange();
    }
};