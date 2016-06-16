
var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var ec = require('components/common/event/event.js');

var Page = Class(function(opts){
//    $('body').html(222);
}).extend({
    init:function(){
        $('.right-side').html('bbbbb');

    }

});
var page = new Page();

module.exports=page;