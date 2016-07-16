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
            me._fix();
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


    _fix:function () {
        //Get window height and the wrapper height
        var height = $(window).height() - $("body > .header").height();
        $(".wrapper").css("min-height", height + "px");
        var content = $(".wrapper").height();
        //If the wrapper height is greater than the window
        if (content > height)
        //then set sidebar height to the wrapper
            $(".left-side, html, body").css({
                "overflow-y": "auto",
                "min-height": (content + 100) + "px"
            });
        else {
            //Otherwise, set the sidebar to the height of the window
            $(".left-side, html, body").css({
                "overflow-y": "auto",
                "min-height": (height + 100 ) + "px"
            });
        }
    } ,
    destroy:function () {
        
    }
});

module.exports=CustomerList;