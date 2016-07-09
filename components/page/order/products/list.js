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
        name:'productName',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'商品类型',
        name:'type',
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
        name:'productNo',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'商品分类',
        name:'class',
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
        name:'banknote',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'发布状态',
        name:'status',
        type:'select',
        options:[
            {text:'全部', value:''},
            {text:'售卖中', value:'1'},
            {text:'为售卖', value:'2'}
        ],
        placeholder:'',
        validate: null
    }
];

var PRODUCT_STATUS = {
    'normal': '正常',
    'blocked': '封停',
    'error': '异常'
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

            //me.renderProductList(data);
            $('#product-list', me.container).empty().append(PRODUCT_LIST.PRODUCT_ITEM(data));



            new Page({
                target: '#product-list-page-wrap',
                type: 'ajax',
                pageCount: Number(data.total_count),
                pageSize: 10,
                callback: function(page){
                    me.getProductList({pageNo:page});
                },
                pn: Number(data.current_page)
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
            var params = {};
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
                    me.changeProductStatus(id,'offShelf');break;
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
            var content = PRODUCT_LIST.PRODUCT_DETAIL(data);

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
        Ajax.post('/admin/product_update',{id:id, status:status}, function (data) {
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