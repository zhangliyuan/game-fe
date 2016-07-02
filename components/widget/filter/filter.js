/**
 * Created by Jason on 2016/6/18.
 * desc 搜索组件
 */

var $=require('/components/common/base/base.js');
var Class=require('/components/common/class/class.js');
require("/components/common/laydate/laydate.js");

var FILTER_ITEM = __inline('filter.tmpl');



var demoData = [
    {
        label:'手机号',
        name:'phoneNo',
        type:'text',
        placeholder:'',
        validate: null
    },
    {
        label:'日期',
        name:'date',
        type:'date-single',
        placeholder:'',
        validate: null
    },
    {
        label:'查询日期',
        name:{
            start:'startDate',
            end:'endDate'
        },
        type:'date-combo',
        
        placeholder:'',
        validate: null
    },
    {
        label:'select框',
        name:'selectData',
        type:'select',
        options:[
            {text:'option1', value:'option1'},
            {text:'option2', value:'option2'},
            {text:'option3', value:'option3'},
            {text:'option4', value:'option4'}
        ],
        placeholder:'',
        validate: null
    }

];

var Filter = Class(function (opts) {
    this.opts = $.extend({
        container:'body',
        filterData:{},
        renderData:null
    },opts);
}).extend({
    init: function () {
        var me = this;

        me.container = $(me.opts.container);
        me.container.addClass('filter-wrap');

        me.render();

        me.initEvents();
    },

    render: function () {
        var me = this;
        var data = me.opts.renderData || demoData;

        var _html = '';
        if($.isArray(data) && data.length > 0){
            $.each(data, function (i, v) {
                _html += FILTER_ITEM(v);
            });
        } else {
            console.log('搜索配置数据为空');
            return;
        }


        me.container.empty().append(_html);

        me.initDate();
    },

    initEvents: function () {
        var me = this;

        me.container.on('change', '.data-item[type="text"], select.data-item', function (event) {
            me.onChangeHandler(event);
        });
    },


    onChangeHandler: function (event) {
        
      var me = this;
        var obj = event.target;
        var _name = $(obj).data('name');
        var _value = encodeURI($.trim($(obj).val()));

        me.setFilterData(_name, _value);

    },

    initDate: function () {
        var me = this;

        $('.date-single, .date-combo', me.container).each(function () {
            if($(this).hasClass('date-single')){
                me.initSingleDate(this);
            }else{
                me.initComboDate(this);
            }

        });


    },

    initSingleDate: function (obj) {
        var me = this;
        var _elem = $(obj).find('li');
        var _id = _elem.attr('id',$.string.uuid()).attr('id');
        var _name = _elem.data('name');
        var _placeholder = _elem.data('placeholder');

        var _date = {
            elem: '#' + _id,
            //format: 'YYYY-MM-DD hh:mm',
            //min: laydate.now(),
            //max: '2099-06-16 23:59:59',
            istime: false, //是否设置时间显示
            istoday: false,
            choose: function(date){
                me.setFilterData(_name, date);
            }
        };
        laydate(_date);
    },

    initComboDate: function (obj) {

        var me = this;
        var _startElem = $(obj).find('li.start');
        var _endElem = $(obj).find('li.end');

        var _startId = _startElem.attr('id',$.string.uuid()).attr('id');
        var _endId = _endElem.attr('id',$.string.uuid()).attr('id');

        var _startName = _startElem.data('name');
        var _endName = _endElem.data('name');

        var _start = {
            elem: '#' + _startId,
            //format: 'YYYY-MM-DD hh:mm',
            //min: laydate.now(),
            //max: '2099-06-16 23:59:59',
            istime: false, //是否设置时间显示
            istoday: false,
            choose: function(date){
                _end.min = date;
                me.setFilterData(_startName, date);
            }
        };

        var _end = {
            elem: '#' + _endId,
            //format: 'YYYY-MM-DD hh:mm',
            //min: laydate.now(),
            //max: '2099-06-16 23:59:59',
            istime: false, //是否设置时间显示
            istoday: false,
            choose: function(date){
                _start.max = date;
                me.setFilterData(_endName, date);
            }
        };

        laydate(_start);
        laydate(_end);

    },

    setFilterData: function (name, value) {
        var me = this;
      if(name === undefined){
         $('.data-item', me.container).each(function () {
             var _elem = this;

             var _name = $(_elem).data('name');
             var _value = $(_elem).value();

             me.setFilterData(_name, _value);

         });
      }  else {
          me.opts.filterData[name] = encodeURI(value);
      }
    },

    getFilterData: function () {
        return this.opts.filterData;
    },

    reset: function(){

    },
    
    destroy: function () {
        
    }
});

module.exports=Filter;