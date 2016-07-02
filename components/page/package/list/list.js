/**
 * Created by Jason on 2016/6/25.
 */


var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var Ajax=require('/components/common/ajax/ajax.js');
var Dialog = require('/components/common/dialog/dialog.js');
var Filter = require('/components/widget/filter/filter.js');
var Page       = require('/components/common/pager/pager.js');
var PopTip = require('/components/common/pop-tip/pop-tip.js');
var CollapseFilter = require('/components/widget/showFilter/collapse-filter.js');

var PACKAGE_LIST = {
    LAYOUT:__inline('list.tmpl'),
    PACKAGE_ITEM:__inline('package-item.tmpl'),
    PACKAGE_DETAIL:__inline('package-detail.tmpl')
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
        label:'礼包类型',
        name:'type',
        type:'select',
        options:[
            {text:'全部', value:''},
            {text:'端游礼包', value:'1'},
            {text:'手游礼包', value:'2'}
        ],
        placeholder:'',
        validate: null
    },
    {
        label:'礼包名称',
        name:'packageName',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'发放方式',
        name:'distribute-type',
        type:'select',
        options:[
            {text:'全部', value:''},
            {text:'限制发放', value:'1'},
            {text:'无限制发放', value:'2'}
        ],
        placeholder:'',
        validate: null
    },
    {
        label:'礼包编号',
        name:'packageNo',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'发布状态',
        name:'status',
        type:'select',
        options:[
            {text:'全部', value:''},
            {text:'正在发放', value:'1'},
            {text:'停止发放', value:'2'}
        ],
        placeholder:'',
        validate: null
    }
];

var PackageList = Class(function (opts) {
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

        me.getPackageList();

        me.initEvents();
    },

    render: function () {
        var me = this;
        var _html = PACKAGE_LIST.LAYOUT({});
        me.container.empty().html(_html);
    },

    getPackageList: function (params) {
        var me = this;

        if(!params){
            params = me.getFilterData();
        }else{
            params = $.extend(me.getFilterData(),params);
        }

        Ajax.get('/admin/package_list', params, function (data) {

            //me.renderOrderList(data);
            $('#package-list', me.container).empty().append(PACKAGE_LIST.PACKAGE_ITEM(data));

            new Page({
                target: '#package-list-page-wrap',
                type: 'ajax',
                pageCount: Number(data.total_count),
                pageSize: 10,
                callback: function(page){
                    me.getPackageList({pageNo:page});
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
            me.getPackageList();
        });



        me.container.on('click', '#package-list .operation', function () {
            var obj = $(this);

            var _operation = obj.data('oper');
            var id = obj.closest('tr').data('id');
            switch (_operation){
                case 'detail':
                    me.showPackageDetail(id);break;
                case 'offShelf':
                    me.changePackageStatus(id,'offShelf');break;
                case 'edit':
                    me.changePackageStatus(id,'edit');break;
                case 'upload':
                    me.changePackageStatus(id,status);break;
                case 'delete':
                    Dialog.confirm('确定要删除该礼包？',{
                        onaccept:function () {
                            me.deletePackage(id);
                            $(this).dialog('close');
                        }
                    });
                    break;


                default:
                    console.log('do nothing');

            }
        });
    },

    showPackageDetail:function(id){
        var me = this;


        Ajax.get('/admin/package_detail',{id:id},function (data) {

            data.distributeType = ['沃曲磊','天啊噜','历史的天看房'][data.distributeType];
            var content = PACKAGE_LIST.PACKAGE_DETAIL(data);

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
    },
    changePackageStatus:function (id,status) {
        Ajax.post('/admin/package_update',{id:id, status:status}, function (data) {
            PopTip('操作成功！！');
        });
    },
    deletePackage:function (id) {
        // TODO 添加确认弹框
        Ajax.post('/admin/package_delete',{id:id}, function (data) {
            PopTip('操作成功！！');
        });
    }
});

module.exports=PackageList;