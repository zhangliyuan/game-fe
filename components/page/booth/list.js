/**
 * Created by Jason on 2016/6/25.
 */

var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');

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
        me.container.empty().html(_html);
        me._fix();
    },
    
    initEvents: function () {
        var me = this;
        
        me.container.off('click');

        me.container.on('click', '.fa-arrow-down, .fa-arrow-up', function (e) {

            var cTr = $(this).closest('tr');
            var direction = $(this).hasClass('fa-arrow-up') ? 'up' : 'down';

            if ('up' === direction && cTr.prev('tr').length > 0) {
                cTr.prev('tr').before(cTr.prop('outerHTML'));
                cTr.remove();
            } else if( 'down' == direction && cTr.next('tr').length > 0) {
                cTr.next('tr').after(cTr.prop('outerHTML'));
                cTr.remove();
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