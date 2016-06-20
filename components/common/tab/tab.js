/**
 * Created by Jason on 2016/6/18.
 */

var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');

var Tab = Class(function (opts) {
    this.opts = $.extend({
        container:'body',
        selected:''

    },opts);


}).extend({
    init: function () {
        var me = this;

        $(me.opts.container).on('click', 'a[data-toggle="tab"]', function () {
           var that = this;

            me.opts.beforeClick && me.execCallback(me.opts.beforeClick, that);

            me.showTabPane(that);

        });

        if(me.opts.selected != ''){
            $('[data-target="'+me.opts.selected+'"]', $(me.opts.container)).trigger('click');
        }
    },

    showTabPane: function (obj) {
      var id = $(obj).data('target');
        var _tabWrap = $(obj).closest('.tab-wrap');

        _tabWrap.find('ul li').removeClass('active');
        $(obj).parent().addClass('active');
        _tabWrap.find('.tab-pane').hide();
        $(''+id, _tabWrap).show();

    },

    execCallback:function (callback, params) {
        callback.call(this.opts.caller || this, params );
    },

    destroy: function () {

    }
});

module.exports=Tab;
