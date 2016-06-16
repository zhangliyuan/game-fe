/**
 * Created by zh.l.y on 2016/6/16.
 */

var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var ec = require('components/common/event/event.js');

var tpl = __inline('union-item.html');
var tpl2 = __inline('union-item.tmpl');
var Page = Class(function(opts){
    //$('body').html(111);
}).extend({
    init:function(){
        $('.right-side').html(111);

    }
});

var page = new Page();

module.exports=page;