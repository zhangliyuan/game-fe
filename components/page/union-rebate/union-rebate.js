/**
 * Created by zh.l.y on 2016/6/16.
 */

var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var Ajax=require('/components/common/ajax/ajax.js');
var Dialog = require('/components/common/dialog/dialog.js');
var Filter = require('/components/widget/filter/filter.js');
var Tab = require('/components/common/tab/tab.js');
var PopTip = require('/components/common/pop-tip/pop-tip.js');
var Page       = require('/components/common/pager/pager.js');


var UNION_REBATE_PAGE ={
    LAYOUT: __inline('union-rebate.tmpl'),
    UNION_REBATE_ITEM:__inline('union-rebate-item.tmpl')
};

var FILTER_OPTIONS = [
    {
        label:'公会状态',
        name:'status',
        type:'select',
        options:[
            {text:'全部', value:'0'},
            {text:'正常', value:'1'},
            {text:'异常', value:'2'},
            {text:'封停', value:'3'}
        ],
        placeholder:'',
        validate: null
    },
    {
        label:'公会状态',
        name:'status',
        type:'select',
        options:[
            {text:'全部', value:'0'},
            {text:'正常', value:'1'},
            {text:'异常', value:'2'},
            {text:'封停', value:'3'}
        ],
        placeholder:'',
        validate: null
    }
];


var UnionRebate = Class(function(opts){
    // do nothing
    this.opts = $.extend({
        container:'.admin-content'
    },opts);
}).extend({

    init:function(){

        var me = this;

        me.container = $(me.opts.container);

        me.container.append(UNION_CHECK_PAGE.LAYOUT({}));

        // render filter module
        me.filter = new Filter({
            container:'#filter-wrap',
            renderData: FILTER_OPTIONS
        });
        //me.filter.init();


        me.getUnionRebateList();

        // render page
        // layout

        // get ajax data

        // init event
        me.initEvents();

    },

    getUnionRebateList: function(params){
        var me = this;
        var params = params ||　me.getFilterData();

        Ajax.get('/admin/union/rebate_list', params, function (data) {

            me.renderUnionRebateList(data.list);
        });

    },

    renderUnionRebateList: function(data){
        var me = this;
        var data = data ? data : demoData;

        var _html = '';
        if($.isArray(data) && data.length > 0){
            _html += UNION_CHECK_PAGE.UNION_CHECK_ITEM({list:data});
        } else {
            _html = '<p>没有任何数据</p>'
        }

        $("#union-rebate-list").empty().append(_html);

    },

    initEvents: function(){
        var me = this;

        $('#union-rebate-list', me.container).on('click', '.showDetail', function(){
            me.showDetail.call(me,this);
        });


        $('.ico-collapse', me.container).on('click', function () {

            me.showFilter.call(me, this);

        });

        $("#exec-search-btn", me.container).on('click', function () {
            me.getUnionRebateList();
        });

    },

    getFilterData: function () {
        var me = this;

        return  me.filter.getFilterData() || {};

        //me.getUnionRebateList(filterData);
    },



    showDetail: function(obj){
        var me = this;
        var obj = $(obj);

        var content = UNION_CHECK_PAGE.UNION_CHECK_DETAIL({});

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
            'open':function () {

                Ajax.get('/admin/union/register_info', {}, function(data){

                    me.renderDetailData($.extend({container:'#register-info'},{response:data}));

                });

                $('.union-detail').on('click', ".operation-btn-wrap .operation", function () {
                    var obj = $(this);

                    var operation = obj.data('oper');
                    var refuseMsg = '';
                    if(operation == 'refuse'){
                        refuseMsg = $('.union-detail #refuse-reason').val();
                    }


                    Ajax.get('/admin/union/check', {
                        type:operation,
                        id: me.cUnionId,
                        refuseMsg:refuseMsg
                    }, function(data){
                        PopTip("操作成功！！");
                    }, function (data) {
                        PopTip(data.msg || '操作失败~~');
                    });
                });


            },
            'buttons': [{
                'text': '同意',
                'className': 'btn btn-primary',
                'click': function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();

                    $(this).dialog('close');

                }
            }, {
                'className': 'btn btn-default',
                'text': '取消',
                'click': function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();

                    $(this).dialog('close');
                }
            }]
        });

    },


    renderDetailData: function(data){
        var me = this;
        var data = data || demoTabData;

        var _tpl = UNION_CHECK_PAGE.REGISTER_INFO;

        var _html = _tpl(data.response);

        $(data.container).empty().append(_html).data('status','loaded');

    },

    destroy: function(){}
});

module.exports=UnionRebate;