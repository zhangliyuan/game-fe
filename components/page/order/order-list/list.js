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
    ORDER_DETAIL: __inline('order-detail.tmpl')
};

var FILTER_OPTIONS = [
    {
        label:'订单编号',
        name:'orderNo',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'下单时间',
        name:{
            start:'startDate',
            end:'endDate'
        },
        type:'date-combo',

        placeholder:'',
        validate: null
    },
    {
        label:'用户账号',
        name:'userAccount',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'订单状态',
        name:'status',
        type:'select',
        options:[
            {text:'全部', value:''},
            {text:'交易成功', value:'1'},
            {text:'等待发货', value:'2'},
            {text:'已退款', value:'3'},
            {text:'用户取消', value:'4'},
            {text:'订单关闭', value:'5'},
            {text:'超时关闭', value:'6'},
            {text:'订单锁定', value:'7'}
        ],
        placeholder:'',
        validate: null
    },
    {
        label:'商品名称',
        name:'productName',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'订单类型',
        name:'type',
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

var UNION_STATUS = {
    'normal': '正常',
    'blocked': '封停',
    'error': '异常'
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
            params = $.extend(me.getFilterData(),params);
        }

        Ajax.get('/admin/order/list', params, function (data) {

            //me.renderOrderList(data);
            $('#order-list', me.container).empty().append(ORDER_LIST.ORDER_ITEM(data));

            new Page({
                target: '#order-list-page-wrap',
                type: 'ajax',
                pageCount: Number(data.total_count),
                pageSize: 10,
                callback: function(page){
                    me.getOrderList({pageNo:page});
                },
                pn: Number(data.current_page)
            });
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
            me.getOrderList();
        });

        me.container.on('click', '.common-filter li', function () {
            var obj = $(this);
            var _name = obj.data('name');
            var _value = obj.data('value');
            var params = {};
            params[_name] = _value;
            me.getOrderList(params);

        });

        me.container.on('click', '#order-list .operation', function () {
           var obj = $(this);

            var _operation = obj.data('oper');
            var id = obj.closest('tr').data('id');
            switch (_operation){
                case 'detail':
                    me.showOrderDetail(id);break;
                case 'cancel':
                    me.changeOrderStatus(id,'cancel');break;
                case 'block':
                    me.changeOrderStatus(id,'block');break;
                case 'refund':
                    me.changeOrderStatus(id,'refund');break;
                default:
                    console.log('do nothing');

            }
        });
    },
    
    showOrderDetail: function (id) {
        var me = this;

        
        Ajax.get('/admin/order/detail',{id:id},function (data) {
            var content = ORDER_LIST.ORDER_DETAIL(data);

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

    changeOrderStatus:function (id,status) {
        Ajax.post('/admin/order/update',{id:id, status:status}, function (data) {
           PopTip('操作成功！！');
        });
    },
    
    destroy:null
});

module.exports=OrderList;