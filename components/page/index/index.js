/**
 * Created by Jason on 2016/6/25.
 */

var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var Ajax=require('/components/common/ajax/ajax.js');
var Page= require('/components/common/pager/pager.js');
var PopTip = require('/components/common/pop-tip/pop-tip.js');
var Dialog = require('/components/common/dialog/dialog.js');


var INDEX_PAGE = {
    LAYOUT:__inline('index.tmpl'),
    NOTICE_ITEM:__inline('notice-item.tmpl'),
    NOTICE_DETAIL:__inline('notice-detail.tmpl'),
    ADD_NOTICE:__inline('add-notice.tmpl')
};
var IndexPage = Class(function (opts) {
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
        var _html = INDEX_PAGE.LAYOUT({});
        me.container.empty().html(_html);
        me.getNoticeList()
    },

    initEvents: function () {
      var me = this;

        me.container.off('click'); // 解除之前該容器內的所有事件委託

        // -------重新綁定事件-------------
        me.container.on('click', '#add-notice-btn', function () {
            me.showAddNotice();
        });

        me.container.on('click', '#notice-list  .notice-detail', function () {
            me.showNoticeDetail(this);
        });
    },
    
    showNoticeDetail: function (obj) {
        var id = $(obj).data('id');
        Ajax.get('/admin/notice/detail', {id:id}, function (data) {


                var content = INDEX_PAGE.NOTICE_DETAIL(data);

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
    
    getNoticeList:function (params) {
        var me = this;
        params = $.extend({},params);
        Ajax.get('/admin/notice/list', params, function (data) {

            $('#notice-list', me.container).empty().html(INDEX_PAGE.NOTICE_ITEM(data));

            new Page({
                target: '#notice-page-wrap',
                type: 'ajax',
                pageCount: Number(data.total_count),
                pageSize: 10,
                callback: function(page){
                    me.getNoticeList({pageNo:page});
                },
                pn: Number(data.current_page)
            });
        });
    },

    showAddNotice: function () {
        var me = this;

        var content = INDEX_PAGE.ADD_NOTICE({});

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
                $('.add-notice-dialog').on('click', ".addNoticeBtn", function () {

                    var title = $('#notice-title').val();
                    var content = $('#notice-content').val();

                    Ajax.get('/admin/notice/add', {
                        title:title,
                        content: content
                    }, function(data){
                        PopTip("操作成功！！");
                        $(_dialog).dialog('close');
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

                    var title = $('#notice-title').val();
                    var content = $('#notice-content').val();

                    var _dialog = this;

                    Ajax.get('/admin/notice/add', {
                        title:title,
                        content: content
                    }, function(data){
                        PopTip("操作成功！！");
                        $(_dialog).dialog('close');
                    }, function (data) {
                        PopTip(data.msg || '操作失败~~');
                    });


                    //$(this).dialog('close');
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

    destroy: null
});

module.exports=IndexPage;