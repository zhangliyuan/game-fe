/**
 * Created by zh.l.y on 2016/6/16.
 */

var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var Ajax=require('/components/common/ajax/ajax.js');
var Dialog = require('/components/common/dialog/dialog.js');
var Filter = require('/components/widget/filter/filter.js');
var Tab = require('/components/common/tab/tab.js');
var Page       = require('/components/common/pager/pager.js');
var PopTip = require('/components/common/pop-tip/pop-tip.js');

var UNION_LIST_PAGE ={
    LAYOUT: __inline('union-list.tmpl'),
    UNION_LIST_ITEM:__inline('union-item.tmpl'),
    UNION_LIST_DETAIL:__inline('union-detail.tmpl')
};

var UNION_DETAIL_TAB = {
    GAME:           __inline('detail-game.tmpl'),
    TEAM:           __inline('detail-team.tmpl'),
    PACKAGE:        __inline('detail-package.tmpl'),
    RULES:          __inline('detail-rules.tmpl'),
    NOTICE:         __inline('detail-notice.tmpl'),
    MEETING_ROOM:   __inline('detail-meeting-room.tmpl'),
    REGISTER_INFO:  __inline('detail-register-info.tmpl')
};

var FILTER_OPTIONS = [
    {
        label:'公会编号',
        name:'guildId',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'会长手机',
        name:'linkMobile ',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'公会名称',
        name:'guildName',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'创建时间',
        name:{
            start:'beginCreateTime',
            end:'endCreateTime'
        },
        type:'date-combo',

        placeholder:'',
        validate: null
    },
    /*{
        label:'身份证号',
        name:'uidcard',
        type:'text',
        placeholder:'',
        validate: null
    },*/
    {
        label:'游戏名称',
        name:'gameName',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'公会状态',
        name:'guildStatus',
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
        label:'会长名称',
        name:'guildName',
        type:'text',
        placeholder:'',
        validate: null
    }
];

var UNION_STATUS = {
    'normal': '正常',
    'blocked': '封停',
    'error': '异常'
};


var Union = Class(function(opts){
    // do nothing
    this.opts = $.extend({
        container:'.admin-content'
    },opts);
}).extend({

    init:function(){

        var me = this;

        me.container = $(me.opts.container);

        me.container.append(UNION_LIST_PAGE.LAYOUT({}));

        // render filter module
        me.filter = new Filter({
            container:'#filter-wrap',
            renderData:FILTER_OPTIONS
        });
        //me.filter.init();


        me.getUnionList();

        // render page
        // layout

        // get ajax data

        // init event
        me.initEvents();

    },

    getUnionList: function(params){
        var me = this;

        if(!params){
            params = me.getFilterData();
        }else{
            params = $.extend({},me.getFilterData(),params);
        }


        Ajax.get('/admin/union_list', params, function (data) {

            me.renderUnionList(data.list);

            new Page({
                target: '#union-list-page-wrap',
                type: 'ajax',
                pageCount: Number(data.total_count),
                pageSize: 10,
                callback: function(page){
                    me.getUnionList({page:page});
                },
                pn: Number(data.current_page)
            });

            if(!data.list || data.list.length == 0){
                $("#union-list").empty().append('<p>没有任何数据</p>');

            }
        });

    },

    renderUnionList: function(data){
        var me = this;
        var data = data ? data : demoData;

        var _html = '';
        if($.isArray(data) && data.length > 0){
            _html += UNION_LIST_PAGE.UNION_LIST_ITEM({list:data, mStatus:UNION_STATUS});
        } else {
            _html = '<p>没有任何数据</p>'
        }
        $("#union-list").empty().append(_html);



    },

    initEvents: function(){
        var me = this;

        me.container.off('click');

        $('#union-list', me.container).on('click', '.showDetail', function(){
            me.showDetail.call(me,this);
        });


        $("#exec-search-btn", me.container).on('click', function () {
           me.getUnionList();
        });


        $('.ico-collapse', me.container).on('click', function () {

            me.showFilter.call(me, this);

        });



    },

    getFilterData: function () {
      var me = this;

        var filterData = me.filter.getFilterData();

        return filterData;
    },

    showFilter: function (obj) {

        var _spanElem = $(obj).find('span');
        var _iElem = $(obj).find('i.fa');

        if(_iElem.hasClass('fa-caret-up')){
            $(obj).siblings().hide();
            _iElem.removeClass('fa-caret-up').addClass('fa-caret-down');
            _spanElem.text('展开');
        } else{
            $(obj).siblings().show();
            _iElem.removeClass('fa-caret-down').addClass('fa-caret-up');
            _spanElem.text('收起');
        }
    },

    showDetail: function(obj){
        var me = this;
        var obj = $(obj);

        me.cUnionId = obj.closest('tr').data('id');

        var content = UNION_LIST_PAGE.UNION_LIST_DETAIL({});

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
                var _tab = new Tab({
                    caller:me,
                    container: '.confirm-dialog .union-detail',
                    beforeClick: me.detailTabClick,
                    selected:'#game'
                });

                $('.union-detail').on('click', ".unblock-wrap input[name='unblock']", function () {
                    var obj = $(this);
                    
                    var operation = obj.val();
                    
                    Ajax.get('/admin/union_block', {
                        type:operation,
                        id: me.cUnionId
                    }, function(data){
                        PopTip("操作成功！！");
                    }, function (data) {
                        PopTip(data.msg || '操作失败~~');
                    });
                });


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

    },

    detailTabClick:function(obj){
        var me = this;
        var targetId = $(obj).data('target');
        var tabContent = $(targetId, me.container);

        if(tabContent.data('status') !== 'loaded'){
            me.getDetailTab({
                url:$(obj).data('url'),
                type: targetId.replace("#", ''),
                container:targetId,
                data:{
                    guildId:me.cUnionId
                }
            });
        }
    },


    getDetailTab: function(params){

        var me = this;

        Ajax.get(params.url, params.data, function(data){

            me.renderTabData($.extend(params,{response:data}));


            new Page({
                target: '#game-table-page-wrap',
                type: 'ajax',
                pageCount: Number(data.total_count),
                pageSize: 10,
                callback: function(page){
                    me.getDetailTab($.extend(params.data,{pageNo:page}));
                },
                pn: Number(data.current_page)
            });

        });
    },

    renderTabData: function(data){
        var me = this;
        var data = data || demoTabData;

        var _tpl = UNION_DETAIL_TAB[data.type.toUpperCase()];

        var _html = _tpl($.extend({mStatus: UNION_STATUS},data.response));

        $(data.container).empty().append(_html).data('status','loaded');

    },

    destroy: function(){}
});

module.exports=Union;