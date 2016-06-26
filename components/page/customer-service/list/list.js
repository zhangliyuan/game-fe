/**
 * Created by Jason on 2016/6/25.
 */


var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');

var CUSTOMER_SERVICE_LIST = {
    LAYOUT:__inline('list.tmpl')
};
var CustomerServiceList = Class(function (opts) {
    this.opts = $.extend({
        container:'.admin-content'
    },opts);
}).extend({
    init:function () {
        var me = this;
        me.container = $(me.opts.container);

        me.render();
    },

    render: function () {
        var me = this;
        var _html = CUSTOMER_SERVICE_LIST.LAYOUT({});
        me.container.empty().html(_html);
    }
});

module.exports=CustomerServiceList;