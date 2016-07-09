/**
 * Created by Jason on 2016/6/25.
 */

var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var Ajax=require('/components/common/ajax/ajax.js');
var PopTip = require('/components/common/pop-tip/pop-tip.js');

var ADD_EMAIL = {
    LAYOUT:__inline('add.tmpl')
};
var AddEmail = Class(function (opts) {
    this.opts = $.extend({
        container:'.admin-content'
    },opts);
}).extend({
    init:function () {
        var me = this;
        me.container = $(me.opts.container);

        me.render();
        me.initEvent();
    },

    render: function () {
        var me = this;
        var _html = ADD_EMAIL.LAYOUT({});
        me.container.empty().html(_html);
    },

    initEvent:function () {
        var me = this;

        me.container.off('click');

        me.container.on('click', '#confirm-add-btn', function () {
            var emailReceiver = me.container.find('#email-address').val();
            var title = me.container.find('#email-title').val();
            var content = me.container.find('#content').val();

            Ajax.post('/admin/add_email', {
                emailReceiver:emailReceiver,
                title:title,
                content:content
            }, function (data) {
                PopTip('发送成功！！！');
                me.render();
            });
        });

    }
});

module.exports=AddEmail;