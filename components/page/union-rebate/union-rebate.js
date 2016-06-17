/**
 * Created by zh.l.y on 2016/6/17.
 */
/**
 * Created by zh.l.y on 2016/6/16.
 */

var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var ec = require('components/common/event/event.js');

var UNION_REBAT_PAGE ={
    LAYOUT: __inline('union-rebate.tmpl')
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

        me.container.append(UNION_REBAT_PAGE.LAYOUT({}));

        // render page
        // layout

        // get ajax data

        // init event

    },

    getUnionList: function(){},

    renderUnionList: function(){},

    initEvents: function(){},

    destroy: function(){}
});

module.exports=UnionRebate;