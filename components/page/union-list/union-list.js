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

var demoData = [
    {
        unionNo:'123456799',
        name:'众神殿游戏公会',
        peopleCount:2411,
        unionPresident:'隔壁王吴老二让人',
        status:'normal',
        createTime:'2014-12-23 12:34:45',
        rank:564,
        recharge:2345,
        totalRecharge:23452
    },
    {
        unionNo:'123456794',
        name:'众神殿游戏公会',
        peopleCount:2411,
        unionPresident:'隔壁王吴老二让人',
        status:'normal',
        createTime:'2014-12-23 12:34:45',
        rank:564,
        recharge:2345,
        totalRecharge:23452
    }
];


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
            container:'#filter-wrap'
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
        var params = params ||　{
                code: 12
            };
        Ajax.get('/front/index_smsCheck', params, function (data) {
            console.log(data);
        });

        me.renderUnionList();
    },

    renderUnionList: function(data){
        var me = this;
        var data = data ? data : demoData;

        var _html = '';
        if($.isArray(data) && data.length > 0){
            _html += UNION_LIST_PAGE.UNION_LIST_ITEM({list:data});
        } else {
            _html = '<p>没有任何数据</p>'
        }

        $("#unionList").empty().append(_html);

    },

    initEvents: function(){
        var me = this;

        $('#unionList', me.container).on('click', '.showDetail', function(){
            me.showDetail.call(me,this);
        });


        $('.ico-collapse', me.container).on('click', function () {

            me.showFilter.call(me, this);

        });

    },

    getFilterData: function () {
      var me = this;

        var filterData = me.filter.getFilterData();

        me.getUnionList(filterData);
    },

    showFilter: function (obj) {
        var me = this;
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


            },
            'buttons': [{
                'text': '使用',
                'className': 'btn btn-primary',
                'click': function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();

                    $(this).dialog('close');
                    me.model.changeStuCtrl(rid, function() {
                        me.view.changeCtrl($t);
                        me.fire('ctrled',rid);  // 改变了某个题集的作答状态
                    });
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
                data:{}
            });
        }
    },


    getDetailTab: function(params){

        var me = this;

        Ajax.get(params.url, params.data, function(data){

            // TODO test data
            data.total_count = 234;
            data.current_page = 4;

            me.renderTabData($.extend(params,{response:data}));


            new Page({
                target: '#game-table-page-wrap',
                type: 'ajax',
                pageCount: Number(data.total_count),
                pageSize: 10,
                callback: function(page){
                    me.getDetailTab(params);
                },
                pn: Number(data.current_page)
            });

        });
    },

    renderTabData: function(data){
        var me = this;
        var data = data || demoTabData;

        var _tpl = UNION_DETAIL_TAB[data.type.toUpperCase()];

        var _html = _tpl(data.response);

        $(data.container).empty().append(_html).data('status','loaded');

    },

    destroy: function(){}
});

module.exports=Union;