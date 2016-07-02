/**
 * Created by Jason on 2016/6/25.
 */


var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
require("/components/common/laydate/laydate.js");
var Ajax=require('/components/common/ajax/ajax.js');
var PopTip = require('/components/common/pop-tip/pop-tip.js');
var Dialog = require('/components/common/dialog/dialog.js');

var ADD_PACKAGE = {
    LAYOUT:__inline('add.tmpl')
};
var AddPackage = Class(function (opts) {
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
        var _html = ADD_PACKAGE.LAYOUT({});
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
        Ajax.get('/admin/product_addInfo',{},function (data) {
            me.addBaseData = data;
            me.initSelectForm(data);

        });
    },

    initSelectForm:function (data) {
        var me = this;
        var supplier = me.container.find('.form-control[name="supplier"]');
        if(!data){
            data = me.addBaseData;
        }

    },


    initEvent:function () {
        var me = this;
        me.container.off('click');


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

            if(productData['online-time'] ==2 ){
                productData['onlineTime'] = $('#set-online-time').text();
            }

            me.addProductData(productData);
        });


        me.container.on('click','#add_game', function () {
            var obj = $(this);
            var dialogHtml = '<div class="form-group"> <label> 游戏名称:</label> <input type="text" class="form-control" id="game_name" name="name" placeholder="" /> </div>';
           Dialog.confirm(dialogHtml,{
               onaccept:function () {
                   var dialog = $(this);
                   var name = $('#game_name').val();
                   Ajax.post('/admin/package_add',{name:name}, function (data) {
                       obj.siblings('select').append('<option value="'+data.value+'">'+data.name+'</option>').val(data.value);

                        dialog.dialog('close');
                   });
               }
           });
        });
    },



    addProductData: function (params) {
        var me = this;

        Ajax.post('/admin/product_add',params, function (data) {
            PopTip('添加成功！！');
            me.render();
        });
    },

    initOnlineTime:function () {
        var me = this;
        var _elem = $('#set-online-time').find('li');

        var _date = {
            elem: '#set-online-time',
            format: 'YYYY-MM-DD hh:mm',
            min: laydate.now(),
            //max: '2099-06-16 23:59:59',
            istime: true, //是否设置时间显示
            istoday: false,
            choose: function(date){
                //me.setFilterData(_name, date);
            }
        };
        laydate(_date);

    }
});

module.exports=AddPackage;