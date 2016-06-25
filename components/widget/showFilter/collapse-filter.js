/**
 * Created by Jason on 2016/6/25.
 */

var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');

var CollapseFilter = Class(function (opts) {
    var me=this;
    this.opts = $.extend({
        container:''
    },opts);

    $(this.opts.container).off('click',me.showFilter);
    $(this.opts.container).on('click', me.showFilter);
}).extend({
    showFilter:function () {
        var obj = this;

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
    }
});

module.exports=CollapseFilter;