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
    UNION_REBATE_SETTLEMENT: __inline('union-rebate-settlement.tmpl'),
    UNION_REBATE_ITEM:__inline('union-rebate-item.tmpl')
};

var FILTER_OPTIONS = [
    {
        label:'公会状态',
        name:'status',
        type:'select',
        options:[
            {text:'全部', value:''},
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
            {text:'全部', value:''},
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
        me.filterData = {month:1};

        me.container.append(UNION_REBATE_PAGE.LAYOUT({}));

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
        params = $.extend({},me.filterData, params);
        Ajax.post('/admin/union_rebateList', params, function (data) {

            me.renderUnionRebateList(data);


            new Page({
                target: '#union-rebate-page-wrap',
                type: 'ajax',
                pageCount: Number(data.total_count),
                pageSize: 10,
                callback: function(page){
                    me.getUnionRebateList({page:page});
                },
                pn: Number(data.current_page)
            });
        });

    },

    renderUnionRebateList: function(data){
        var me = this;
        var data = data ? data : demoData;

        var _html = '';
        if($.isArray(data.list) && data.list.length > 0){
            _html += UNION_REBATE_PAGE.UNION_REBATE_ITEM(data);
        } else {
            _html = '<p>没有任何数据</p>'
        }

        $("#union-rebate-list").empty().append(_html);

    },

    initEvents: function(){
        var me = this;

        me.container.off('click');

        $('#union-rebate-list', me.container).on('click', '.showDetail', function(){
            me.showDetail.call(me,this);
        });



        me.container.on('click', '.nav-tabs a.filter-item', function () {
            var obj = this;
            var month = $(obj).data('value');
            me.filterData.month = month;
            me.getUnionRebateList();


        });

        me.container.on('change', '.nav-tabs select.filter-item', function () {
            var obj = this;
            console.log($(obj));
            var name = $(obj).data('name');
            var value = $(obj).val();

            me.filterData[name] = value;

            me.getUnionRebateList();
        });

        me.container.on('click', '#union-rebate-list .operation', function () {
            var obj = $(this);

            var _operation = obj.data('oper');
            var id = obj.closest('tr').data('id');
            me.cAccountId = id;
            switch (_operation){
                case 'settlement':
                    me.getSettlement(id);break;

                case 'detail':
                    me.getDetail(id);break;

                default:
                    console.log('do nothing');

            }
        });


    },



    showDetail: function(obj){
        var me = this;
        var obj = $(obj);

        var content = UNION_REBATE_PAGE.UNION_CHECK_DETAIL({});

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

    getSettlement: function(id){
        var me = this;

        Ajax.get('/admin/union_rebate_detail', {id:id}, function(data){
            var _tpl = UNION_REBATE_PAGE.UNION_REBATE_SETTLEMENT;
            var content=_tpl(data);

            Dialog.confirm(content, {
                'width': '800px',
                'height': 'auto',
                'minHeight': 0,
                'dialogClass': 'confirm-dialog',
                'title':'结算明细',
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

        });


    },

    destroy: function(){}
});

module.exports=UnionRebate;