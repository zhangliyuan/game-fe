/**
 * Created by zh.l.y on 2016/6/16.
 */

var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var Ajax=require('/components/common/ajax/ajax.js');
var Dialog = require('/components/common/dialog/dialog.js');
var Filter = require('/components/widget/filter/filter.js');
var Tab = require('/components/common/tab/tab.js');
var ChartBar = require('/components/common/chart-bar/chart-bar.js');
var PopTip = require('/components/common/pop-tip/pop-tip.js');
var Page       = require('/components/common/pager/pager.js');
 require('/components/lib/highcharts/highcharts.src.js');


var UNION_REBATE_PAGE ={
    LAYOUT: __inline('union-rebate.tmpl'),
    UNION_REBATE_SETTLEMENT: __inline('union-rebate-settlement.tmpl'),
    UNION_REBATE_DETAIL: __inline('union-rebate-detail.tmpl'),
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

var  CATEGORIES = {
    'day':['1时','2时','3时','4时','5时','6时','7时','8时','9时','10时','11时','12时','13时','14时','15时','16时'],
    'month':['1日','2日','3日','4日','5日','6日','7日','8日','9日','10日','11日','12日'],
    'year':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
};

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
            var _li = $(obj).closest('li');
            _li.siblings().removeClass('active');
            _li.addClass('active');
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
            me.cRebateId = id;
            switch (_operation){
                case 'settlement':
                    me.getSettlement(id);break;

                case 'detail':
                    me.showDetail(id);break;

                default:
                    console.log('do nothing');

            }
        });


    },



    showDetail: function(id){
        var me = this;

        Ajax.get('/admin/union_rebate_detail', {id:id}, function(data) {
            me.cRebateDetail = data;

            var content = UNION_REBATE_PAGE.UNION_REBATE_SETTLEMENT(data) +
                UNION_REBATE_PAGE.UNION_REBATE_DETAIL(data);

            Dialog.confirm(content, {
                'width': '1000px',
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

                    me.drawHighCharts("#bar-chart-wrap", {});
                    me.drawHighCharts("#bar-chart-wrap2", {});

                    $('.union-rebate-detail').off('click').on('click', '.chart-btn', function () {
                        var _ul = $(this).closest('ul');
                        var type = _ul.data('name');
                        var byData = $(this).data('name');

                        var _data = me.cRebateDetail.charts[type][byData];

                        var chartBox = $(this).closest('.box').find('.chart-center');

                        me.drawHighCharts(chartBox, {
                            xData:{
                                data:_data,
                                name: type == 'rebate' ? '返点金额': '消费记录'
                            },
                            categories:CATEGORIES[byData]
                        });



                    });


                },
                'buttons': [{
                    'text': '确定',
                    'className': 'btn btn-primary',
                    'click': function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();

                        $(this).dialog('close');

                    }
                }, {
                    'className': 'btn btn-default',
                    'text': '取消',
                    'click': function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();

                        $(this).dialog('close');
                    }
                }]
            });

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

    drawHighCharts:function (elem, data) {

        var options = $.extend({
            title:'柱状图展示',
            categories:[
                '一月',
                '二月',
                '三月',
                '四月',
                '五月',
                '六月',
                '七月',
                '八月',
                '九月',
                '十月',
                '十一月',
                '十二月'
            ],
            yAxis:{
                min: 0,
                title: {
                    text: '金额 (￥)'
                }
            },
            xData:{
                name: '返点金额',
                data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1],
                dataLabels:{
                    enabled:true
                }

            }
        },data);

        if($.type(elem) === 'string'){
            elem = $(elem);
        }
        elem.highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: options.title
            },
            /*subtitle: {
             text: 'Source: WorldClimate.com'
             },*/
            xAxis: {
                categories: options.categories
            },
            yAxis: options.yAxis,
            legend:{
                enabled:false
            },
            credits:{
                enabled:false
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [ options.xData]
        });
    },


    destroy: function(){}
});

module.exports=UnionRebate;