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

var LOG_LIST = {
    LAYOUT:__inline('list.tmpl'),
    LOG_ITEM:__inline('log-item.tmpl')
};
var LogList = Class(function (opts) {
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
        var _html = LOG_LIST.LAYOUT({});
        me.container.empty().html(_html);
        me.filter = new Filter({
            container:'#filter-wrap',
            renderData:FILTER_OPTIONS
        });
        me.getLogList();
    },

    initEvent: function () {
        var me = this;

        new CollapseFilter({
            container:'.ico-collapse'
        });

        me.container.off('click');
        me.container.on('click','#exec-search-btn', function () {
            me.getLogList();
        });
        me.container.on('click','#export-table-data', function () {
            me.exportTable();
        });
    },

    getFilterData: function () {
        var me = this;

        var filterData = me.filter.getFilterData();

        return filterData;
    },
    
    getLogList: function (params) {
        var me = this;
        if(!params){
            params = me.getFilterData();
        }else{
            params = $.extend(me.getFilterData(),params);
        }

        Ajax.get('/admin/log_list', params, function (data) {
            var _html = LOG_LIST.LOG_ITEM(data);

            $('#log-list').empty().append(_html);

            new Page({
                target: '#log-list-page-wrap',
                type: 'ajax',
                pageCount: Number(data.total_count),
                pageSize: 10,
                callback: function(page){
                    me.getLogList({page:page});
                },
                pn: Number(data.current_page)
            });
        });
        
        
    }
});

var FILTER_OPTIONS = [
    {
        label:'操作人姓名',
        name:'name',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'操作时间',
        name:{
            start:'startDate',
            end:'endDate'
        },
        type:'date-combo',
        placeholder:'',
        validate: null
    },
    {
        label:'所属部门',
        name:'department',
        type:'select',
        options:[
            {text:'全部', value:''},
            {text:'客服部', value:'1'},
            {text:'行政部', value:'2'},
            {text:'销售部', value:'3'},
            {text:'人事部', value:'4'}
        ],
        validate: null
    },
    {
        label:'功能模块',
        name:'function',
        type:'select',
        options:[
            {text:'全部', value:''},
            {text:'交易成功', value:'1'},
            {text:'等待发货', value:'2'}
        ],
        validate: null
    }
];
module.exports=LogList;