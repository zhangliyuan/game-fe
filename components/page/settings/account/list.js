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

var ACCOUNT_LIST = {
    LAYOUT:__inline('list.tmpl'),
    ACCOUNT_ITEM:__inline('account-item.tmpl'),
    ACCOUNT_DETAIL:__inline('list.tmpl'),
    ACCOUNT_ADD:__inline('list.tmpl'),
    ACCOUNT_EDIT:__inline('list.tmpl')
};
var AccountList = Class(function (opts) {
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
        var _html = ACCOUNT_LIST.LAYOUT({});
        me.container.empty().html(_html);


        me.filter = new Filter({
            container:'#filter-wrap',
            renderData:FILTER_OPTIONS
        });

        me.getAccountList();
    },

    getFilterData: function () {
        var me = this;

        var filterData = me.filter.getFilterData();

        return filterData;
    },
    
    getAccountList: function (params) {
        var me = this;
        if(!params){
            params = me.getFilterData();
        }else{
            params = $.extend(me.getFilterData(),params);
        }

        Ajax.get('/admin/account_list', params, function (data) {
            var _html = ACCOUNT_LIST.ACCOUNT_ITEM(data);

            $('#account-list').empty().append(_html);

            new Page({
                target: '#account-list-page-wrap',
                type: 'ajax',
                pageCount: Number(data.total_count),
                pageSize: 10,
                callback: function(page){
                    me.getAccountList({page:page});
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
            me.getAccountList();
        });
        me.container.on('click','#export-table-data', function () {
            me.exportTable();
        });
        
        
        me.container.on('click', '#account-list .operation', function () {
            var obj = $(this);

            var _operation = obj.data('oper');
            var id = obj.closest('tr').data('id');
            me.cAccountId = id;
            switch (_operation){
                case 'resetPwd':
                    me.resetPassword(id);break;
               
                default:
                    console.log('do nothing');

            }
        });
    },
    
    getAccountDetail: function () {
        
    },

    addAccount:function (params) {

    },

    getPermissions:function () {

    },

    resetPassword:function (id) {
        var me  =this;

        Ajax.post('/admin/account_resetPwd',{id:id}, function (data) {
            PopTip(data.msg || '重置密码成功！');
        });
    },

    updatePermissions:function (params) {

    },

    destroy:function () {

    }


    
    
});

var FILTER_OPTIONS = [
    {
        label:'工号',
        name:'jobNumber',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'姓名',
        name:'name',
        type:'text',
        placeholder:'',
        validate: null
    }
];

module.exports=AccountList;