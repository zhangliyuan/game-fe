/**
 * Created by Jason on 2016/6/25.
 */


var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var Ajax=require('/components/common/ajax/ajax.js');
var PopTip = require('/components/common/pop-tip/pop-tip.js');

var ADD_CUSTOMER_SERVICE = {
    LAYOUT:__inline('add.tmpl')
};
var AddCustomerService = Class(function (opts) {
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
        var _html = ADD_CUSTOMER_SERVICE.LAYOUT({});
        me.container.empty().html(_html);
    },

    initEvents:function () {
      var me = this;

        me.container.off('click');
        me.container.on('click', '#confirm-add-btn', function (e) {

            var _data = me.getAddServiceData();

            me.addService(_data);


        });

        me.container.on('click', '.iradio_minimal', function (e) {

            var parent = $(this).closest('.form-group');

            parent.find('.iradio_minimal').removeClass('checked');

            $(this).addClass('checked');
        });
    },

    getAddServiceData: function () {

        var me = this;
        var _data = {};

        $('.add-incoming .form-control', me.container).each(function () {
            if(!$(this).hasClass('no-data')){
                var _name = $(this).attr('name');
                var _value = $(this).val();
                _data[_name] = _value;
            }
        });

        var   workOrder = me.container.find('.iradio_minimal.checked');
        var parent = workOrder.closest('.radio');
        var workOrderValue = workOrder.find('input').val();
        var workOrderObj = {
            value:workOrderValue
        };

        switch (workOrderValue){
            case '1':
                break;
            case '2':
                workOrderObj.replyTime = parent.find('select:first').val();
                workOrderObj.replyType = parent.find('select:last').val();
                break;
            case '3':
                workOrderObj.replyTime = parent.find('select:first').val();
                workOrderObj.replyType = parent.find('select[name="type"]').val();
                workOrderObj.replyPeople = parent.find('select:last').val();
                break;
            default:
                // do nothing
        }
        _data.workOrderObj = workOrderObj;

        return _data;
    },

    addService:function (params) {

        var me = this;

        Ajax.post('/admin/service_add', params, function (data) {
           PopTip('成功添加服务！！');
        });
    },

    destroy:function () {

    }
});

module.exports=AddCustomerService;