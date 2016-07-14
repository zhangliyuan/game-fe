/**
 * Created by Jason on 2016/6/25.
 */


var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var Ajax=require('/components/common/ajax/ajax.js');
var PopTip = require('/components/common/pop-tip/pop-tip.js');

var CUSTOMER_LIST = {
    LAYOUT:__inline('list.tmpl'),
    CUSTOMER_DETAIL:__inline('customer-detail.tmpl')
};
var CustomerList = Class(function (opts) {
    this.opts = $.extend({
        container:'.admin-content'
    },opts);
}).extend({
    init:function () {
        var me = this;
        me.container = $(me.opts.container);

        me.render();
        me.initEvents();
    },

    render: function () {
        var me = this;
        var _html = CUSTOMER_LIST.LAYOUT({});
        me.container.empty().html(_html);
    },
    
    getCustomerDetail:function (params) {
        var me = this;

        var keyword = $.trim(me.container.find('#keyword').val());
        
        Ajax.get('/admin/customer_detail', {keyword:keyword}, function (data) {
            var _html =CUSTOMER_LIST.CUSTOMER_DETAIL(data);

                me.container.find('.customer-info-box').empty().append(_html);
        });
    },

    initEvents:function () {
      var me =this;

        me.container.off('click');

        me.container.on('click', '#exec-search-btn', function () {
            me.getCustomerDetail();
        });

        me.container.on('click', ".update-customer-btn", function () {
            me.updateCustomer();
        });
    },


    updateCustomer:function () {
        var me = this;

        var id = me.cCustomerId;
        var data = me.getCustomerUpdateData();

        Ajax.post('/admin/customer_update',{
            id:id,
            data:data
        }, function (data) {
            PopTip('客户资料更新成功！！');
        });
    },

    getCustomerUpdateData:function () {
        var me = this;
        var data = {};

        return data || {};
    },

    destroy:function () {
        
    }
});

module.exports=CustomerList;