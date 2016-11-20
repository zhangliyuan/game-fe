/**
 * Created by Jason on 2016/6/25.
 */


var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
require("/components/common/laydate/laydate.js");
var Ajax=require('/components/common/ajax/ajax.js');
var Dialog = require('/components/common/dialog/dialog.js');
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


var SUPPLIERS = [
    {id:0,name:'---请选择供应商---'},
    {id:1,name:'福禄充值'},
    {id:2,name:'瑞联充值'}
];

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

        me.initEvent();
    

    },

    render: function () {
        var me = this;
        var _html = ADD_PRODUCTS.LAYOUT({});
        me.container.empty().html(_html);
        if(!me.addBaseData){
            me.getBaseInfo();
        }else{
            me.initSelectForm();
        }

        me.initOnlineTime();

    },
    
    getBaseInfo: function () {
        var me = this;
        Ajax.get('/admin/game_list',{},function (data) {
            me.addBaseData = data;
            me.initSelectForm(data);

        });
    },

    initSelectForm:function (data) {
        var me = this;
        var supplier = me.container.find('.form-control[name="supplierId"]');
        var local_game = me.container.find('.form-control[name="gameId"]');
        if(!data){
            data = me.addBaseData;
        }

        if(data.list){
            local_game.empty();
            $.each(data.list,function (i,v) {
                local_game.append('<option value="'+v.id+'" title="'+v.gameName+'">'+v.gameName+'</option>');
            });
        }else{
            PopTip('本地游戏列表空');
            return;
        }

        data.suppliers = SUPPLIERS;
        if(data.suppliers){
            supplier.empty();
            $.each(data.suppliers,function (i,v) {
                supplier.append('<option value="'+v.id+'" title="'+v.name+'">'+v.name+'</option>');
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


        $('.product-type', me.container).on('change',  function (e) {

            var value = $(this).val();
            
            if('2' == value){
                console.log(value);
            } else {
                console.log(value);
            }
        });
        
        $('.form-control[name="supplierId"]', me.container).on('change', function () {
            
            var supplier = $(this).val();

            if(supplier == 0){
                return false;
            }
            
            if(supplier){

                me.suppliers = supplier;

                Ajax.get('/admin/getFLLeim',{type: supplier},function (data) {


                    me.gameList = data.list;

                    me.dialogGameList();

                });
                
            } else {
                PopTip('supplier id is empty');
            }
        });




        me.container.on('click', '.modify-game', function () {
            var obj = $(this);
            me.dialogGameList();
        });
        me.container.on('click', '.fa-plus-circle', function () {
            var obj = $(this);

            var banknote = obj.prev('select').val();
            var innerPrice = obj.prev('select').find('option[value="'+banknote+'"]').data('inner-price');

            me.addBanknote.call(me,{value:banknote,innerPrice:innerPrice});
        });
        me.container.on('click', '.fa-minus-circle', function () {
            var obj = $(this);

            var _uuid = obj.closest('.value-item').data('id');
            me.container.find('.value-item-wrap').find('.value-item[data-id="'+_uuid+'"]').remove();
        });

        $("#banknote-select", me.container).on('change', function () {

        //me.container.on('click','#banknote-select option',function () {
           var obj = $(this);
            var value = obj.val();

            if(value == 0){
                return false;
            }
            var innerPrice = obj.find('option[value="'+value+'"]').data('inner-price');
            obj.closest('.value-item').find('.value-label').text(innerPrice + '元');
            obj.closest('.value-item').find('.form-control[name="salePrice"]').val(innerPrice);
        });

        me.container.off('change');
        me.container.on('change','.online-time-select',function () {
            var obj = $(this);
            var value = obj.val();

            if(value == 2){
                obj.next().removeClass('none');
            }else{
                obj.next().addClass('none');
            }
        });


        me.container.on('click','#confirm-add-btn', function () {
            var productData = {};
            me.container.find('.box-body > .form-group').each(function () {
                var obj = $(this);
                var item = obj.find('.form-control');
                var name = item.attr('name');
                var value = item.val();
                productData[name] = value;
            });

            if(productData['online-time'] == 2 ){
                productData['onlineTime'] = $('#set-online-time').text();
            }
            //productData['banknotes'] = $.json.stringify(me.getBanknoteData());
            productData = $.extend(true,productData, me.getBanknoteData()[0]);

            me.addProductData(productData);
        });
    },

    getBanknoteData: function () {
        var me = this;
        var banknoteData = [];
        var dataItems = me.container.find('.value-item-wrap .value-item');

        dataItems.each(function (i,v) {
            var _data = {};
            $(v).find('.form-control').each(function () {
                var name = $(this).attr('name');
                var value = $(this).val();

                _data[name] = value;
            });

            banknoteData.push(_data);
        });

        return banknoteData;
    },

    addProductData: function (params) {
      var me = this;

        //Ajax.post('/admin/product_add',params, function (data) {
        Ajax.post('/admin/product_add',params, function (data) {
           PopTip('添加成功！！');
            me.render();
            me.initEvent();
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

    },


    getBankNoteList:　function (id) {

        var me = this;
        id = id || me.currentGame.id;
        Ajax.get('/admin/getFLGoods',{type:me.suppliers, nums: id},function (data) {

            var banknoteSelect = $('#banknote-select', me.container);


            if(data.list){
                banknoteSelect.empty();
                //banknoteSelect.append('<option value="0" >--请选择面值--</option>');
                $.each(data.list,function (i,v) {
                    banknoteSelect.append('<option value="'+v.GoodsID+'" data-inner-price="'+v.PurchasePrice+'" title="'+v.GoodsParvalue+'元">'+v.GoodsParvalue+'元</option>');
                });

                $('.value-group', me.container).removeClass('none');
                banknoteSelect.closest('.value-item').find('.value-label').text(data.list[0].PurchasePrice + '元');
                banknoteSelect.closest('.value-item').find('.form-control[name="salePrice"]').val(data.list[0].innerPrice);


            }else{
                PopTip('该游戏面值列表为空~');
                return;
            }



        });
    },


    dialogGameList: function (list) {

        var me = this;

        list = list || me.gameList;

        var content = '<div ><div id="label-info">';
        if (me.currentGame){
            content += '已选择游戏：<span class="game-name">'+ me.currentGame.name + '</span>';
        } else {
            content += '请选择游戏:';
        }
        content += '</div><div class="game-list">';

        $.each(list, function (i, v) {

            content += '<a class="fl game-item" data-id="'+v.GoodsCatalogID+'" href="javascript:void(0);">' + v.GoodsCatalogName + '</a>';

        });

        content += '</div></div>';


        Dialog.confirm(content, {
            'width': '800px',
            'height': 'auto',
            'minHeight': 0,
            'dialogClass': 'select-game-dialog',
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

            'open': function () {

                $('body .select-game-dialog .game-item').on('click', function (e) {

                    $(this).siblings().removeClass('current');
                    $(this).addClass('current');

                    me.currentGame = {
                        id: $(this).data('id'),
                        name: $(this).text()
                    };

                    $('.select-game-dialog #label-info').html('已选择游戏：<span class="game-name">'+ me.currentGame.name + '</span>');


                });
            },

            'close': function () {

                $("#selected-game").next().removeClass('none');
                $("#selected-game").text(me.currentGame.name).data('id', me.currentGame.id);
                console.log(me.currentGame);

                me.getBankNoteList(); // 获取该游戏的面值列表
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
    }
});

module.exports=AddProducts;