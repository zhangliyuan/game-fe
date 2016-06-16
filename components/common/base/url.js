var $ = require('components/lib/jquery/jquery.js');

/**
 * 对字符串进行%#&+=以及和\s匹配的所有字符进行url转义
 * @name baidu.url.escapeSymbol
 * @function
 * @grammar baidu.url.escapeSymbol(source)
 * @param {string} source 需要转义的字符串.
 * @return {string} 转义之后的字符串.
 * @remark
 * 用于get请求转义。在服务器只接受gbk，并且页面是gbk编码时，可以经过本转义后直接发get请求。
 *
 * @return {string} 转义后的字符串
 */
var escapeSymbol = function(source) {

    //TODO: 之前使用\s来匹配任意空白符
    //发现在ie下无法匹配中文全角空格和纵向指标符\v，所以改\s为\f\r\n\t\v以及中文全角空格和英文空格
    //但是由于ie本身不支持纵向指标符\v,故去掉对其的匹配，保证各浏览器下效果一致
    return String(source).replace(/[#%&+=\/\\\ \u3000\f\r\n\t]/g, function(all) {
        return '%' + (0x100 + all.charCodeAt()).toString(16).substring(1).toUpperCase();
    });
};

exports.escapeSymbol = escapeSymbol;




var queryString = function (key) {
    var value = location.search.match(new RegExp("[\?\&]" + key + "=([^\&]*)(\&?)", "i"));
    return value ? decodeURIComponent(value[1]) : "";
};

exports.queryString = queryString;


var hash = function(key) {
    var value = location.hash.match(new RegExp("[\#\&]" + key + "=([^\&]*)(\&?)", "i"));
    return value ? decodeURIComponent(value[1]) : "";
};

exports.hash = hash;


function query (url, key, value, type) {
    type = type == 'hash' ? '#' : '?';
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);
    if (url.indexOf(type) < 0) {
        return url + type + key + '=' + value;
    } else {
        var p = key + '=';
        if (url.indexOf('&' + p) < 0 && url.indexOf(type + p) < 0) {
            return url + '&' + key + '=' + value;
        } else {
            var exp = new RegExp(key + '\=[^\\&]*', 'ig');
            return url.replace(exp, key + '=' + value);
        }
    }
}

// DOTO: 如果 url 有 hash 会被干掉;
// 因此方法一般用于异步请求等, 暂时无影响;
var setParam = function(url, key, value) {
    if ( /^data\:image\//i.test(url) ) {
        return url;
    }
    if ($.type(key) === 'object') {
        for (var i in key) {
            url = arguments.callee(url, i, key[i]);
        }
        return url;
    }
    return query.apply(query, arguments);
};

exports.setParam = setParam;


// location search 支持 hash;
var setQuery = function(json, type) {
    type = type || 'search';
    var href = {
        origin: location.origin,
        pname: location.pathname,
        search: location.search,
        hash: location.hash
    };
    for (var i in json) {

        href[ type ] = query( href[ type ], i, json[ i ], type );
    }
    return location.href = href.origin + href.pname + href.search + href.hash;
};

exports.set = setQuery;


/**
 * 将json对象解析成query字符串
 * @name baidu.url.jsonToQuery
 * @function
 * @grammar baidu.url.jsonToQuery(json[, replacer])
 * @param {Object} json 需要解析的json对象
 * @param {Function=} replacer_opt 对值进行特殊处理的函数，function (value, key)
 * @see baidu.url.queryToJson,baidu.url.getQueryValue
 *
 * @return {string} - 解析结果字符串，其中值将被URI编码，{a:'&1 '} ==> "a=%261%20"。
 */
var jsonToQuery = function (json, replacer_opt) {
    var result = [],
        itemLen,
        replacer = replacer_opt || function (value) {
          return escapeSymbol(value);
        };

    $.each(json, function(key, item){
        // 这里只考虑item为数组、字符串、数字类型，不考虑嵌套的object
        if ($.isArray(item)) {
            itemLen = item.length;
            // value的值需要encodeURIComponent转义吗？
            // FIXED 优化了escapeSymbol函数
            while (itemLen--) {
                result.push(key + '=' + replacer(item[itemLen], key));
            }
        } else {
            result.push(key + '=' + replacer(item, key));
        }
    });

    return result.join('&');
};

exports.jsonToQuery = jsonToQuery;

/**
 * 解析目标URL中的参数成json对象
 * @name baidu.url.queryToJson
 * @function
 * @grammar baidu.url.queryToJson(url)
 * @param {string} url 目标URL
 * @see baidu.url.jsonToQuery
 *
 * @returns {Object} - 解析为结果对象，其中URI编码后的字符不会被解码，'a=%20' ==> {a:'%20'}。
 */
var queryToJson = function (url) {
    var endIndex = url.indexOf('#') == -1 ? url.length : url.indexOf('#'),
        query   = url.substring(url.indexOf('?') + 1, endIndex),
        params  = query.split('&'),
        len     = params.length,
        result  = {},
        i       = 0,
        key, value, item, param;

    for (; i < len; i++) {
        if(!params[i]){
            continue;
        }
        param   = params[i].split('=');
        key     = param[0];
        value   = param[1];

        item = result[key];
        if ('undefined' == typeof item) {
            result[key] = value;
        } else if ($.isArray(item)) {
            item.push(value);
        } else { // 这里只可能是string了
            result[key] = [item, value];
        }
    }

    return result;
};

exports.queryToJson = queryToJson;
