
var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var ec = require('components/common/event/event.js');

var tpl = __inline('views/layout/layout.html');
var Page = Class(function(opts){
    //$('body').html(111);
}).extend({
    init:function(){
        $('.right-side').html(111);

    }
});

var page = new Page();

module.exports=page;