/**
 * Created by Jason on 2016/6/25.
 */


var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
require("/components/common/laydate/laydate.js");
var Ajax=require('/components/common/ajax/ajax.js');
var PopTip = require('/components/common/pop-tip/pop-tip.js');

var BANKNOTE='<div class="value-item"><select class="form-control select-form" name="banknote "  data-banknote="20" >'
    +'<option value="1" title="title">10元</option>'
    +'<option value="2" title="title">20元</option>'
    +'<option value="3" title="title">50元</option>'
    +'<option value="4" title="title">100元</option>'
    +'<option value="5" title="title">1000元</option>'
    +'</select>'
    +'<i class="fa fa-1x fa-plus-circle"></i>'
    +'</div>';

var ADD_PRODUCTS = {
    LAYOUT:__inline('add-product.tmpl'),
    ADD_BANKNOTE:__inline('add-banknote.tmpl')
};
var AddProducts = Class(function (opts) {
    this.opts = $.extend({
        container:'.admin-content'
    },opts);
}).extend({
    init:function () {
        var me = this;
        me.container = $(me.opts.container);

        me.render();

        me.initOnlineTime();
        me.initEvent();
    

    },

    render: function () {
        var me = this;
        var _html = ADD_PRODUCTS.LAYOUT({});
        me.container.empty().html(_html);
        me.getBaseInfo();
    },
    
    getBaseInfo: function () {
        var me = this;
        Ajax.get('/admin/product/add_info',{},function (data) {
            var supplier = me.container.find('.form-control[name="supplier"]');

            if(data.suppliers){
                supplier.empty();
                $.each(data.suppliers,function (i,v) {
                    supplier.append('<option value="'+v.value+'" title="'+v.text+'">'+v.text+'</option>');
                });
            }else{
                PopTip('供应商信息为空');
                return;
            }
            
            var banknotes = me.container.find('.value-item-wrap');
            if(data.banknotes){
                me.banknotes = [].concat(data.banknotes);
                banknotes.empty();
                me.addBanknote(data.banknotes[0]);

                var _banknoteWrap = me.container.find('.value-item-wrap');
                _banknoteWrap.find('.fa-minus-circle').addClass('fa-plus-circle').removeClass('fa-minus-circle');
            }
        });
    },

    addBanknote: function (item) {
        var me = this;
        var _uuid = $.string.uuid();

            var _html = ADD_PRODUCTS.ADD_BANKNOTE($.extend({banknote:item.value, uuid:_uuid, banknotes:me.banknotes},item));

            var _wrap = me.container.find('.value-item-wrap');
            _wrap.append(_html);


        me.container.find('.value-item-wrap').find('.value-item[data-id="'+_uuid+'"]').find('select').val(item.value);

    },

    initEvent:function () {
      var me = this;
        me.container.off('click');



        me.container.on('click', '.fa-plus-circle', function () {
            var obj = $(this);

            var banknote = obj.prev('select').val();
            var innerPrice = obj.prev('select').find('option[value="'+banknote+'"]').data('inner-price')

            me.addBanknote.call(me,{value:banknote,innerPrice:innerPrice});
        });
        me.container.on('click', '.fa-minus-circle', function () {
            var obj = $(this);

            var _uuid = obj.closest('.value-item').data('id');
            me.container.find('.value-item-wrap').find('.value-item[data-id="'+_uuid+'"]').remove();
        });

        me.container.on('change','select[name="banknote"]',function () {
           var obj = $(this);
            var value = obj.val();
            var innerPrice = obj.find('option[value="'+value+'"]').data('inner-price');
            obj.closest('.value-item').find('.value-label').text(innerPrice + '元');
        }),

        $('.online-time-select',me.container).off('change');
        $('.online-time-select',me.container).on('change',function () {
            var obj = $(this);
            var value = obj.val();

            if(value == 2){
                obj.next().removeClass('none');
            }else{
                obj.next().addClass('none');
            }
        });
    },

    initOnlineTime:function () {
            var me = this;
            var _elem = $('#set-online-time').find('li');

            var _date = {
                elem: '#set-online-time',
                //format: 'YYYY-MM-DD hh:mm',
                min: laydate.now(),
                //max: '2099-06-16 23:59:59',
                istime: false, //是否设置时间显示
                istoday: false,
                choose: function(date){
                    //me.setFilterData(_name, date);
                }
            };
            laydate(_date);

    }
});

module.exports=AddProducts;