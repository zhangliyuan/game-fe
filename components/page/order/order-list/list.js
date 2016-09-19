/**
 * Created by Jason on 2016/6/25.
 */


var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var Ajax=require('/components/common/ajax/ajax.js');
var Dialog = require('/components/common/dialog/dialog.js');
var Filter = require('/components/widget/filter/filter.js');
var Tab = require('/components/common/tab/tab.js');
var Page       = require('/components/common/pager/pager.js');
var PopTip = require('/components/common/pop-tip/pop-tip.js');
var CollapseFilter = require('/components/widget/showFilter/collapse-filter.js');

var ORDER_LIST = {
    LAYOUT:__inline('list.tmpl'),
    ORDER_ITEM: __inline('order-item.tmpl'),
    ORDER_EDIT: __inline('order-edit.tmpl'),
    ORDER_DETAIL: __inline('order-detail.tmpl')
};

var FILTER_OPTIONS = [
    {
        label:'订单编号',
        name:'orderId',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'下单时间',
        name:{
            start:'createTime',
            end:'endTime'
        },
        type:'date-combo',

        placeholder:'',
        validate: null
    },
    {
        label:'用户账号',
        name:'uid',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'订单状态',
        name:'orderStatus',
        type:'select',
        options:[
            {text:'全部', value:''},
            {text:'待付款', value:'1'},
            {text:'待发货', value:'2'},
            {text:'已发货', value:'3'},
            {text:'已完成', value:'4'},
            {text:'已退款', value:'5'},
            {text:'已取消', value:'6'},
            {text:'已锁定', value:'7'}
        ],
        placeholder:'',
        validate: null
    },
    {
        label:'商品名称',
        name:'goodName',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'订单类型',
        name:'orderType',
        type:'select',
        options:[
            {text:'全部', value:''},
            {text:'游戏充值', value:'1'},
            {text:'话费充值', value:'2'}
        ],
        placeholder:'',
        validate: null
    }
];
//订单类型：1，游戏充值，2话费充值，
var ORDER_TYPE = {
    '1': '话费充值',
    '2': '话费充值'
};

//订单状态：1，等待用户付款2，等待发货，3，已发货，4，成功订单5，退款订单6，取消订单 7已锁定
var ORDER_STATUS = {
    '1': '待付款',
    '2': '待发货',
    '3': '已发货',
    '4': '已完成',
    '5': '已退款',
    '6': '已取消',
    '7': '已锁定'
};


var OrderList = Class(function (opts) {
    this.opts = $.extend({
        container:'.admin-content'
    },opts);
}).extend({
    init:function () {
        var me = this;
        me.container = $(me.opts.container);

        me.render();
        me.filter = new Filter({
            container:'#filter-wrap',
            renderData:FILTER_OPTIONS
        });
        me.getOrderList();

        me.initEvents();
    },

    getOrderList: function (params) {
        var me = this;

        if(!params){
            params = me.getFilterData();
        }else{
            params = $.extend({},me.getFilterData(),params);
        }

        Ajax.post('/admin/order_list', params, function (data) {

            if(data && data.list && data.list.length > 0){
                $('#order-list', me.container).empty().append(ORDER_LIST.ORDER_ITEM($.extend({statusMap:ORDER_STATUS},data)));


            }else{
                $('#order-list', me.container).empty().append('<tr class="text-center"><td colspan="9">没有任何数据！！！</td></tr>');
            }

            new Page({
                target: '#order-list-page-wrap',
                type: 'ajax',
                pageCount: Number(data.total_count),
                pageSize: 10,
                callback: function(page){
                    me.getOrderList({page:page});
                },
                pn: Number(data.current_page || params.page)
            });

        });
    },

    exportTable: function (params) {
        var me = this;

        if(!params){
            params = me.getFilterData();
        }else{
            params = $.extend(me.getFilterData(),params);
        }

        Ajax.post('/admin/order_export', params, function (data) {
        //Ajax.post('/getOrderInfo.action', params, function (data) {

            //me.renderOrderList(data);
            window.open(data.url, '_blank');
        });
    },

    render: function () {
        var me = this;
        var _html = ORDER_LIST.LAYOUT({});
        me.container.empty().html(_html);
        

    },

    getFilterData: function () {
        var me = this;

        var filterData = me.filter.getFilterData();

        return filterData;
    },

    initEvents: function () {
        var me = this;

        new CollapseFilter({
            container:'.ico-collapse'
        });

        me.container.off('click');
        me.container.on('click','#exec-search-btn', function () {
            me.getOrderList({page:1});
        });
        me.container.on('click','#export-table-data', function () {
            me.exportTable();
        });

        me.container.on('click', '.common-filter li', function () {
            var obj = $(this);
            var _name = obj.data('name');
            var _value = obj.data('value');
            var params = {};
            params[_name] = _value;
            params.page = 1;
            me.getOrderList(params);

        });

        me.container.on('click', '#order-list .operation', function () {
           var obj = $(this);

            var _operation = obj.data('oper');
            var id = obj.closest('tr').data('id');
            me.cOrderId = id;
            switch (_operation){
                case 'detail':
                    me.showOrderDetail(id);break;
                case 'edit':
                    me.showOrderEdit(id);break;
                case 'cancel':
                    me.changeOrderStatus(id,'6');break;
                case 'block':
                    me.changeOrderStatus(id,'block');break;
                case 'refund':
                    me.changeOrderStatus(id,'5');break;
                default:
                    console.log('do nothing');

            }
        });
    },
    
    showOrderDetail: function (id,type) {
        var me = this;

        
        Ajax.get('/admin/order_detail',{id:id},function (data) {
            var content = ORDER_LIST.ORDER_DETAIL($.extend(data,{statusMap:ORDER_STATUS, typeMap: ORDER_TYPE}));

            Dialog.confirm(content, {
                'width': '800px',
                'height': 'auto',
                'minHeight': 0,
                'dialogClass': 'confirm-dialog',
                'draggable': false,
                'show': {
                    'effect': 'drop',
                    'mode': 'show',
                    'direction': 'down',
                    'duration': 100
                },
                'hide': {
                    'effect': 'drop',
                    'direction': 'down',
                    'duration': 200
                },

                'buttons': [{
                    'text': '确定',
                    'className': 'btn btn-primary',
                    'click': function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();

                        $(this).dialog('close');
                    }
                }]
            });

        });
    },
    showOrderEdit: function (id) {
        var me = this;


        Ajax.get('/admin/order_detail',{id:id},function (data) {
            var content = ORDER_LIST.ORDER_EDIT($.extend({},data,{statusMap:ORDER_STATUS, typeMap: ORDER_TYPE}));


            Dialog.confirm(content, {
                'width': '800px',
                'height': 'auto',
                'minHeight': 0,
                'dialogClass': 'confirm-dialog',
                'draggable': false,
                'show': {
                    'effect': 'drop',
                    'mode': 'show',
                    'direction': 'down',
                    'duration': 100
                },
                'hide': {
                    'effect': 'drop',
                    'direction': 'down',
                    'duration': 200
                },

                'open': function () {
                    $('select[name="orderStatus"] option[value="'+data.orderStatus+'"]')[0].click();
                    $('select[name="payWay"] option[value="'+data.orderStatus+'"]').trigger('click');
                },

                'buttons': [{
                    'text': '确定',
                    'className': 'btn btn-primary',
                    'click': function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        var _dialog = this;
                        me.editOrder($.extend({},data, me.getEditData('#order-edit')), function () {
                            $(_dialog).dialog('close');
                        });
                    }
                },{
                    'text': '取消',
                    'className': 'btn btn-default',
                    'click': function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();

                       $(this).dialog('close');
                    }
                }]
            });

        });
    },

    getEditData: function (container) {
        var me = this;
        if($.type(container) === 'string'){
            container = $(container);
        }

        var forms = container.find('.form-control');
        var data = {
            id:me.cOrderId
        };
        $.each(forms, function (i, v) {
            var name = $(v).attr('name');
                var value = $(v).val();

            data[name] = value;
        });

        return data;
    },

    editOrder: function (data, cb) {

        var me  =this;

        Ajax.post('/admin/order_update',data, function (data) {
           PopTip(data.msg || '编辑成功！');
            cb && cb();
        });
    },

    changeOrderStatus:function (id,status) {
        Ajax.post('/admin/order_update_data',{id:id, orderStatus:status}, function (data) {
           PopTip('操作成功！！');
        });
    },
    
    destroy:null
});

module.exports=OrderList;