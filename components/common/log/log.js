/**
* @desc log组件
* @author nuer
* @time 20160401
*/

'use strict';

var $ = require('/components/lib/jquery/jquery.js');



// 临时统计参数;
var _tmpOptions = {};


// 发送一个img log请求;
exports.load = function( url ) {
    var img = new Image();
    var key = '_okay_id_' + $.now();

    window[ key ] = img;

    img.onload = img.onerror = img.onabort = function() {

        img.onload = img.onerror = img.onabort = null;

        window[ key ] = img = null;
    };

    img.src = url;
};


// 发送一个统计;
exports.send = function( obj ) {
    var url = 'http://jiaoshi.okjiaoyu.cn/images/o.gif?';
    var params = {
        // 平台id;
        pid: 1,
        // 当前统计页;
        burl: location.href,
        // 清缓存;
        _t: +new Date()
    };
    // _tmpOptions 中的内容用完什么时候删, 暂时还没想好, 暂时保留;
    $.extend(
        params,
        _tmpOptions[ 'global' ] || {},
        _tmpOptions[ obj.action ] || {},
        obj
    );

    url += $.param( params );
    exports.load( url );
};


// 添加统计参数;
// 区分临时还是全局;
exports.add = function( obj, opt ) {
    // 可以在send前增加一些单其它参数, 多用于逻辑行为中;
    // opt.split 分隔符, 默认',';
    // opt.append 追加, 如果是number并且split为空时直接相加;
    // opt.action 加入到指定作用域中;
    obj = obj || {}, opt = opt || {};
    opt.action = opt.action || 'global';
    if(!_tmpOptions[opt.action]){
        _tmpOptions[opt.action] = obj;        
    }else{
        opt.append = ($.isNumeric(opt.append) && !opt.split) ? opt.append : (opt.append ? (opt.split || ',') + opt.append : '');
        $.each(obj, function(i, item){
            if(!_tmpOptions[opt.action][i] || opt.append === ''){
                _tmpOptions[opt.action][i] = item;
            }else{
                _tmpOptions[opt.action][i] += opt.append + item;
            }
        });
    }
};


// log区域事件委托;
exports.bind = function( obj ) {
    // $( obj.query ).on(obj.action, obj.target, fn);
    // <a data-log="a:1,b:2,ac:'click'></a>";
};


// 解析 log 属性;
exports.parse = function() {
    // "a:1,b:2,ac:'click'";
    // return {a:1, b:2, ac:"click"};
};
