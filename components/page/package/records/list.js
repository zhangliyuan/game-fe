/**
 * Created by Jason on 2016/6/25.
 */


var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');

var PACKAGE_RECORDS = {
    LAYOUT:__inline('list.tmpl')
};
var PackageRecords = Class(function (opts) {
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
        var _html = PACKAGE_RECORDS.LAYOUT({});
        me.container.empty().html(_html);
    }
});

module.exports=PackageRecords;