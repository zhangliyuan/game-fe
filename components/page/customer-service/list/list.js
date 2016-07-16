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

var CUSTOMER_SERVICE_LIST = {
    LAYOUT:__inline('list.tmpl'),
    SERVICE_ITEM:__inline('service-item.tmpl'),
    REPLY_SERVICE:__inline('service-reply.tmpl')
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
        me.initEvent();
    },

    render: function () {
        var me = this;
        var _html = CUSTOMER_SERVICE_LIST.LAYOUT({});
        me.container.empty().html(_html);
        me.filter = new Filter({
            container:'#filter-wrap',
            renderData:FILTER_OPTIONS
        });
        me.getServiceList();
    },

    initEvent: function () {
        var me = this;

        new CollapseFilter({
            container:'.ico-collapse'
        });

        me.container.off('click');
        me.container.on('click','#exec-search-btn', function () {
            me.getServiceList();
        });


        me.container.on('click', '#service-list .operation', function () {
            var obj = $(this);

            var _operation = obj.data('oper');
            var id = obj.closest('tr').data('id');
            me.cServiceId = id;
            switch (_operation){
                case 'close':
                    me.closeQuestion(id);break;
                case 'reply':
                    me.replyQuestion(id);break;
                default:
                    console.log('do nothing');

            }
        });
    },

    getFilterData: function () {
        var me = this;

        var filterData = me.filter.getFilterData();

        return filterData;
    },

    getServiceList: function (params) {
        var me = this;
        if(!params){
            params = me.getFilterData();
        }else{
            params = $.extend(me.getFilterData(),params);
        }

        Ajax.get('/admin/service_list', params, function (data) {
            var _html = CUSTOMER_SERVICE_LIST.SERVICE_ITEM(data);

            $('#service-list').empty().append(_html);

            new Page({
                target: '#service-list-page-wrap',
                type: 'ajax',
                pageCount: Number(data.total_count),
                pageSize: 10,
                callback: function(page){
                    me.getServiceList({page:page});
                },
                pn: Number(data.current_page)
            });
        });


    },
    closeQuestion:function (id) {
        Ajax.post('/admin/service_close',{id:id}, function () {
            PopTip('关闭成功！！');
        });
    },


    replyQuestion: function () {
        var me = this;

            var content = CUSTOMER_SERVICE_LIST.REPLY_SERVICE();

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

                        var type = $('#service-reply #reply-type').val();
                        var content = $('#service-reply #service-content').val();
                        Ajax.post('/admin/service_reply', {
                            id:me.cServiceId,
                            type:type,
                            content:content
                        }, function (data) {
                            PopTip('回复成功！！！');
                            Dialog.close();
                        });
                    }
                }]
            });
    }
});

module.exports=CustomerServiceList;


var FILTER_OPTIONS = [
    {
        label:'问题编号',
        name:'questionNo',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'提交时间',
        name:{
            start:'startDate',
            end:'endDate'
        },
        type:'date-combo',
        placeholder:'',
        validate: null
    },{
        label:'用户手机',
        name:'phoneNo',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'问题状态',
        name:'status',
        type:'select',
        options:[
            {text:'全部', value:''},
            {text:'已处理', value:'1'},
            {text:'未处理', value:'2'},
            {text:'超时未处理', value:'3'},
            {text:'加急优先处理', value:'4'}
        ],
        validate: null
    },{
        label:'用户名称',
        name:'name',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'问题类型',
        name:'type',
        type:'select',
        options:[
            {text:'全部', value:''},
            {text:'订单问题', value:'1'},
            {text:'支付问题', value:'1'},
            {text:'登陆问题', value:'1'},
            {text:'投诉建议', value:'1'},
            {text:'其他', value:'2'}
        ],
        validate: null
    }
];