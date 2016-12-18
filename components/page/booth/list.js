/**
 * Created by Jason on 2016/6/25.
 */

var $=require('/components/common/base/base.js');
var Ajax=require('/components/common/ajax/ajax.js');
var Class=require('/components/common/class/class.js');
var Dialog = require('/components/common/dialog/dialog.js');

var BOOTH_LIST = {
    LAYOUT:__inline('list.tmpl')
};
var BoothList = Class(function (opts) {
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
        var _html = BOOTH_LIST.LAYOUT({});

        Ajax.get('/admin/getHotVideo', {}, function (data) {
            data.videoList = data.list;
            var _html = BOOTH_LIST.LAYOUT(data);
            me.container.empty().html(_html);
        });


        me.container.empty().html(_html);
        me._fix();
    },
    
    initEvents: function () {
        var me = this;
        
        me.container.off('click');

        me.container.on('click', '.fa-arrow-down, .fa-arrow-up', function (e) {

            var cTr = $(this).closest('tr');
            var direction = $(this).hasClass('fa-arrow-up') ? 'up' : 'down';
            var id = cTr.data('id') || '';
            var videoSort = cTr.data('videosort') || '';
            var url = '/admin/videoSort';
            var _params = {
                id:id,
                videoSort:videoSort,
                isDown: 'up' == direction ? 1 : 2
            };
            Ajax.get(url, _params, function (data) {
                if ('up' === direction && cTr.prev('tr').length > 0) {

                    cTr.prev('tr').before(cTr.prop('outerHTML'));
                    cTr.next('tr').data('videosort', (parseInt(cTr.next('tr').data('videosort')) - 1));
                    cTr.next('tr').next('tr').data('videosort' , (videoSort + 1));
                    cTr.remove();
                } else if( 'down' == direction && cTr.next('tr').length > 0) {
                    cTr.next('tr').after(cTr.prop('outerHTML'));
                    cTr.next('tr').data('videosort', (parseInt(cTr.next('tr').data('videosort')) + 1));
                    cTr.next('tr').next('tr').data('videosort' , (videoSort - 1));
                    cTr.remove();
                }
            });


        });

        me.container.on('click', '.operation', function (e) {

            e.preventDefault(); e.stopPropagation();

            var _operation = $(this).data('oper');

            switch (_operation){
                case 'delete':
                    var id = $(this).closest('tr').data('id');
                    me.deleteVideo(id);break;
                case 'preview':
                    var _videoUrl = $(this).data('src') || '';
                    if(/^http:\/\//ig.test(_videoUrl)){
                        me.previewVideo(_videoUrl);
                    } else {
                        alert('视频地址404~~');
                    }
                    break;
                default:
                    //do nothing;

            }


        });

        
        me.container.on('click', '.bottom-title .fa', function () {
           $(this).closest('.game-item').remove();
        });

        me.container.on('change', '#game-select-box', function () {
           me.container.find('.game-booth-list').append('<div class="game-item"> '+
               '<img src="http://placehold.it/200x200">'+
               ' <div class="bottom-title"> <span>DOTA2</span> '+
               '<span class="fa-stack "> <i class="fa fa-circle fa-stack-2x f-red"></i> '+
               '<i class="fa fa-close fa-stack-1x f-black"></i> </span> </div> </div>');

            me._fix();
        });
    },

    deleteVideo: function (id) {
        var url = '/admin/videoDel';
        var _params = {
            id:id
        };
        Ajax.get(url, _params, function (data) {
            var cTr = $('[data-id="'+id+'"]');
            cTr.remove();
        });


    },

    previewVideo: function (src) {

        var content = '<div style="text-align: center;"><video  controls autobuffer  webkit-playsinline>'+
                '<source src="'+src+'" type="video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\""></source>'+
                '</video></div>';

        Dialog.confirm(content, {
            'width': '500px',
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

    },

    _fix:function () {
        //Get window height and the wrapper height
        var height = $(window).height() - $("body > .header").height();
        $(".wrapper").css("min-height", height + "px");
        var content = $(".wrapper").height();
        //If the wrapper height is greater than the window
        if (content > height)
        //then set sidebar height to the wrapper
            $(".left-side, html, body").css({
                "overflow-y": "auto",
                "min-height": (content + 100) + "px"
            });
        else {
            //Otherwise, set the sidebar to the height of the window
            $(".left-side, html, body").css({
                "overflow-y": "auto",
                "min-height": (height + 100 ) + "px"
            });
        }
    }

    
});

module.exports=BoothList;