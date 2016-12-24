/**
 * Created by Jason on 2016/6/25.
 */


var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
var Ajax=require('/components/common/ajax/ajax.js');
var Dialog = require('/components/common/dialog/dialog.js');
var Filter = require('/components/widget/filter/filter.js');
var Tab = require('/components/common/tab/tab.js');
var Page       = require('/components/common/pager/pager.js');
var PopTip = require('/components/common/pop-tip/pop-tip.js');
var CollapseFilter = require('/components/widget/showFilter/collapse-filter.js');

var PRODUCT_LIST = {
    LAYOUT:__inline('list.tmpl'),
    PRODUCT_ITEM: __inline('product-item.tmpl'),
    PRODUCT_EDIT: __inline('product-edit.tmpl'),
    PRODUCT_DETAIL: __inline('product-detail.tmpl')
};

var FILTER_OPTIONS = [
    {
        label:'商品名称',
        name:'goodName',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'商品类型',
        name:'goodType',
        type:'select',
        options:[
            {text:'全部', value:''},
            {text:'话费充值', value:'1'},
            {text:'游戏充值', value:'2'}
        ],
        placeholder:'',
        validate: null
    },
    {
        label:'商品编号',
        name:'goodNum',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'商品分类',
        name:'isOnline',
        type:'select',
        options:[
            {text:'全部', value:''},
            {text:'虚拟类', value:'1'},
            {text:'实体类', value:'2'}
        ],
        placeholder:'',
        validate: null
    },
    {
        label:'商品面值',
        name:'facePrice',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'发布状态',
        name:'goodStatus',
        type:'select',
        options:[
            {text:'全部', value:''},
            {text:'售卖中', value:'1'},
            {text:'未售卖', value:'2'}
        ],
        placeholder:'',
        validate: null
    }
];

var PRODUCT_TYPE = {
    '1': '游戏充值',
    '2': '话费充值',
    '3': '流量充值'
};
var PRODUCT_STATUS = {
    '1': '售卖中',
    '2': '未售卖'
};
var PRODUCT_CLASS = {
    '1': '虚拟类',
    '2': '实体类'
};


var ProductList = Class(function (opts) {
    this.opts = $.extend({
        container:'.admin-content'
    },opts);
}).extend({
    init:function () {
        var me = this;
        me.container = $(me.opts.container);

        me.render();
        me.filter = new Filter({
            container:'#filter-wrap',
            renderData:FILTER_OPTIONS
        });
        me.getProductList();

        me.initEvents();
    },

    getProductList: function (params) {
        var me = this;

        if(!params){
            params = me.getFilterData();
        }else{
            params = $.extend(me.getFilterData(),params);
        }

        Ajax.get('/admin/product_list', params, function (data) {


            $('#product-list', me.container).empty().append(PRODUCT_LIST.PRODUCT_ITEM($.extend({},data,{STATUS_MAP:PRODUCT_STATUS, PRODUCT_TYPE:PRODUCT_TYPE})));



            new Page({
                target: '#product-list-page-wrap',
                type: 'ajax',
                pageCount: Number(data.total_count),
                pageSize: 10,
                callback: function(page){
                    me.getProductList({page:page});
                },
                pn: Number(data.current_page || params.pageincoming)
            });
        });
    },

    render: function () {
        var me = this;
        var _html = PRODUCT_LIST.LAYOUT({});
        me.container.empty().html(_html);
        

    },

    getFilterData: function () {
        var me = this;

        var filterData = me.filter.getFilterData();

        return filterData;
    },

    initEvents: function () {
        var me = this;

        new CollapseFilter({
            container:'.ico-collapse'
        });

        me.container.off('click');
        me.container.on('click','#exec-search-btn', function () {
            me.getProductList();
        });

        me.container.on('click', '.common-filter li', function () {
            var obj = $(this);
            var _name = obj.data('name');
            var _value = obj.data('value');
            var params = {
                'goodProfit':'',
                'goodTotal':''
            };

            params[_name] = _value;
            me.getProductList(params);

        });

        me.container.on('click', '#product-list .operation', function () {
           var obj = $(this);

            var _operation = obj.data('oper');
            var id = obj.closest('tr').data('id');
            switch (_operation){
                case 'detail':
                    me.showProductDetail(id);break;
                case 'edit':
                    me.editProductDetail(id);break;
                case 'offShelf':
                    me.changeProductStatus(id,'isOnline');break;
                case 'block':
                    me.changeProductStatus(id,'block');break;
                case 'copyLink':
                    me.copyLink(obj,'copyLink');break;
                default:
                    console.log('do nothing');

            }
        });
    },
    
    showProductDetail: function (id) {
        var me = this;

        
        Ajax.get('/admin/product_detail',{id:id},function (data) {
            var content = PRODUCT_LIST.PRODUCT_DETAIL($.extend({},data,{STATUS_MAP:PRODUCT_STATUS, PRODUCT_TYPE:PRODUCT_TYPE, PRODUCT_CLASS:PRODUCT_CLASS}));

            Dialog.confirm(content, {
                'width': '800px',
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

        });
    },
    editProductDetail: function (id) {
        var me = this;


        Ajax.get('/admin/product_detail',{id:id},function (data) {
            var content = PRODUCT_LIST.PRODUCT_EDIT(data);

            Dialog.confirm(content, {
                'width': '800px',
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
                open: function () {

                    var _top = parseInt($(this).closest('.ui-dialog').css('top'));
                    $(this).closest('.ui-dialog').css('top', (_top + 80) + 'px');

                    var _$dialog = $(this);

                    $('select[name="type"]', _$dialog).val(data.type);
                    $('select[name="goodType"]', _$dialog).val(data.goodType);
                    $('select[name="goodStatus"]', _$dialog).val(data.goodStatus);

                },

                'buttons': [{
                    'text': '确定',
                    'className': 'btn btn-primary',
                    'click': function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();

                        me.editProduct(me.getEditData('#product-edit'));
                    }
                },{
                    'text': '取消',
                    'className': 'btn btn-default',
                    'click': function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();

                        $(this).dialog('close');
                    }
                }]
            });

        });
    },

    getEditData: function (container) {
        var me = this;
        if($.type(container) === 'string'){
            container = $(container);
        }

        var forms = container.find('.form-control');
        var data = {
            id:me.cOrderId
        };
        $.each(forms, function (i, v) {
            var name = $(v).attr('name');
            var value = $(v).val();

            data[name] = value;
        });

        return data;
    },

    editProduct: function (data) {

        var me  =this;

        Ajax.post('/admin/product_update',data, function (data) {
            PopTip(data.msg || '编辑成功！');
        });
    },
    changeProductStatus:function (id,status) {
        Ajax.post('/admin/' + status ||'product_update_data',{id:id}, function (data) {
           PopTip('操作成功！！');
        });
    },

    copyLink:function (obj,operation) {
            var id = obj.attr('id');
           if(!obj.data('init')){

               obj.data('init', true);
               var clipboard = new Clipboard("#" + id);

               clipboard.off('success').on('success', function(e) {
                   alert('复制成功！');

                   e.clearSelection();
               });

               clipboard.on('error', function(e) {
                   console.error('copy error:', e);
               });
           }


    },

    destroy:null
});

module.exports=ProductList;