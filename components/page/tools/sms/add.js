/**
 * Created by Jason on 2016/6/25.
 */

var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var Ajax=require('/components/common/ajax/ajax.js');
var PopTip = require('/components/common/pop-tip/pop-tip.js');

var ADD_SMS = {
    LAYOUT:__inline('add.tmpl')
};
var AddSMS = Class(function (opts) {
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
        var _html = ADD_SMS.LAYOUT({});
        me.container.empty().html(_html);
    },

    initEvent:function () {
        var me = this;

        me.container.off('click');

        me.container.on('click', '#confirm-add-btn', function () {
            var phoneNo = me.container.find('#phoneNo').val();
            var content = me.container.find('#content').val();

            Ajax.post('/admin/add_sms', {
                phoneNo:phoneNo,
                content:content
            }, function (data) {
                PopTip('发送成功！！！');
                me.render();
            });
        });

    }
});

module.exports=AddSMS;