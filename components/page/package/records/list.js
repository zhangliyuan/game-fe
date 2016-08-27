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


var PACKAGE_RECORDS = {
    LAYOUT:__inline('list.tmpl'),
    PACKAGE_RECORD_ITEM: __inline('package-record-item.tmpl'),
    PACKAGE_RECORD_DETAIL: __inline('package-record-detail.tmpl')
};


var FILTER_OPTIONS = [
    {
        label:'游戏名称',
        name:'gameName',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'手机号',
        name:'phoneNumber',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'礼包名称',
        name:'giftName',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'礼包编号',
        name:'giftCode',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'礼包CDK',
        name:'giftId',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'CDK状态',
        name:'recodeStatus',
        type:'select',
        options:[
            {text:'全部', value:''},
            {text:'已淘号', value:'1'},
            {text:'未淘号', value:'2'}
        ],
        placeholder:'',
        validate: null
    }
];

var PACKAGE_STATUS = {
    'normal': '正常',
    'blocked': '封停',
    'error': '异常'
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
        me.filter = new Filter({
            container:'#filter-wrap',
            renderData:FILTER_OPTIONS
        });

        me.getPackageRecordList();

        me.initEvents();
    },

    render: function () {
        var me = this;
        var _html = PACKAGE_RECORDS.LAYOUT({});
        me.container.empty().html(_html);
    },

    getPackageRecordList: function (params) {
        var me = this;

        if(!params){
            params = me.getFilterData();
        }else{
            params = $.extend(me.getFilterData(),params);
        }

        Ajax.get('/admin/packageRecord_list', {params: $.json.stringify(params)}, function (data) {

            //me.renderOrderList(data);
            $('#package-record-list', me.container).empty().append(PACKAGE_RECORDS.PACKAGE_RECORD_ITEM(data));

            new Page({
                target: '#package-record-list-page-wrap',
                type: 'ajax',
                pageCount: Number(data.total_count),
                pageSize: 10,
                callback: function(page){
                    me.getPackageRecordList({pageNo:page});
                },
                pn: Number(data.current_page)
            });
        });
    },

    initEvents: function () {
        var me = this;

        new CollapseFilter({
            container:'.ico-collapse'
        });

        me.container.off('click');
        me.container.on('click','#exec-search-btn', function () {
            me.getPackageRecordList();
        });



        me.container.on('click', '#package-record-list .operation', function () {
            var obj = $(this);

            var _operation = obj.data('oper');
            var id = obj.closest('tr').data('id');
            switch (_operation){
                case 'detail':
                    me.showPackageRecordDetail(id);break;
                default:
                    console.log('do nothing');

            }
        });
    },

    showPackageRecordDetail:function(id){
        var me = this;


        Ajax.get('/admin/packageRecord_detail',{id:id},function (data) {
            var content = PACKAGE_RECORDS.PACKAGE_RECORD_DETAIL(data);

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
    getFilterData: function () {
        var me = this;

        var filterData = me.filter.getFilterData();

        return filterData;
    }



});

module.exports=PackageRecords;