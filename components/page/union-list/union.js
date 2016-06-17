/**
 * Created by zh.l.y on 2016/6/16.
 */

var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var ec = require('components/common/event/event.js');

var UNION_LIST_PAGE ={
    LAYOUT: __inline('union-list.tmpl'),
    UNION_LIST_ITEM:__inline('union-item.tmpl')
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

        me.getUnionList();

        // render page
        // layout

        // get ajax data

        // init event
        me.initEvents();

    },

    getUnionList: function(){
        var me = this;


        me.renderUnionList();
    },

    renderUnionList: function(data){
        var me = this;
        var data = data ? data : demoData;

        var _html = '';
        if($.isArray(data) && data.length > 0){
            $.each(data, function(i, v){
                _html += UNION_LIST_PAGE.UNION_LIST_ITEM(v);
            });
        } else {
            _html = '<p>没有任何数据</p>'
        }

        $("#unionList").empty().append(_html);

    },

    initEvents: function(){
        var me = this;

        $('#unionList', me.container).on('click', '.showDetail', me.showDetail);

    },

    showDetail: function(){

        var obj = $(this);

        if(obj.hasClass('fa-caret-square-o-down')){
            obj.removeClass('fa-caret-square-o-down').addClass('fa-caret-square-o-up');
            obj.closest('.item').find('.item-detail').show();
        }else{
            obj.removeClass('fa-caret-square-o-up').addClass('fa-caret-square-o-down');
            obj.closest('.item').find('.item-detail').hide();
        }

    },

    destroy: function(){}
});

module.exports=Union;