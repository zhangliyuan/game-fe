var $ = require('components/lib/jquery/jquery.js');


module.exports = {
    /**
     * 验证字符串是否合法的cookie键名
     *
     * @param {string} source 需要遍历的数组
     * @meta standard
     * @return {boolean} 是否合法的cookie键名
     */
    _isValidKey: function(key) {
        // http://www.w3.org/Protocols/rfc2109/rfc2109
        // Syntax:  General
        // The two state management headers, Set-Cookie and Cookie, have common
        // syntactic properties involving attribute-value pairs.  The following
        // grammar uses the notation, and tokens DIGIT (decimal digits) and
        // token (informally, a sequence of non-special, non-white space
        // characters) from the HTTP/1.1 specification [RFC 2068] to describe
        // their syntax.
        // av-pairs   = av-pair *(";" av-pair)
        // av-pair    = attr ["=" value] ; optional value
        // attr       = token
        // value      = word
        // word       = token | quoted-string

        // http://www.ietf.org/rfc/rfc2068.txt
        // token      = 1*<any CHAR except CTLs or tspecials>
        // CHAR       = <any US-ASCII character (octets 0 - 127)>
        // CTL        = <any US-ASCII control character
        //              (octets 0 - 31) and DEL (127)>
        // tspecials  = "(" | ")" | "<" | ">" | "@"
        //              | "," | ";" | ":" | "\" | <">
        //              | "/" | "[" | "]" | "?" | "="
        //              | "{" | "}" | SP | HT
        // SP         = <US-ASCII SP, space (32)>
        // HT         = <US-ASCII HT, horizontal-tab (9)>

        return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
    },


    /**
     * 获取cookie的值(未解码)
     * @param {string} key cookie的键名
     * @return {string|null} cookie值，获取不到时返回null
     */
    getRaw: function(key) {
        if ($.cookie._isValidKey(key)) {
            var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
                result = reg.exec(document.cookie);

            if (result) {
                return result[2] || null;
            }
        }
        return null;
    },
    /**
     * 获取cookie的值，用decodeURIComponent进行解码
     * @param {string} key cookie的键名
     * @return {string|null} cookie值，获取不到时返回null
     */
    get: function(key) {
        var value = $.cookie.getRaw(key);
        if ('string' === typeof value) {
            value = decodeURIComponent(value);
            return value;
        }
        return null;
    },
    /**
     * 设置cookie的值(未解码)
     * @param {string} key cookie的键名
     * @param {string} value cookie的值
     * @param {Object} [options] cookie的其他可选参数
     */
    setRaw: function(key, value, options) {
        if (!$.cookie._isValidKey(key)) {
            return;
        }

        options = options || {};

        // 计算cookie过期时间
        var expires = options.expires;
        if ('number' === typeof options.expires) {
            expires = new Date();
            expires.setTime(expires.getTime() + options.expires);
        }

        document.cookie = key + "=" + value +
            (options.path ? "; path=" + options.path : "") +
            (expires ? "; expires=" + expires.toGMTString() : "") +
            (options.domain ? "; domain=" + options.domain : "") +
            (options.secure ? "; secure" : '');
    },
    /**
     * 设置cookie的值，用encodeURIComponent进行编码
     * @param {string} key cookie的键名
     * @param {string} value cookie的值
     * @param {Object} [options] cookie的其他可选参数
     * @config {Date|number} [expires] cookie过期时间,如果类型是数字的话, 单位是毫秒
     * @config {string} [domain] cookie域名
     * @config {string} [secure] cookie是否安全传输
     */
    set: function(key, value, options) {
        $.cookie.setRaw(key, encodeURIComponent(value), options);
    },
    // 删除cookie
    del: function(key){
        var value = $.cookie.getRaw(key);
        if ('string' === typeof value) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            document.cookie= name + "="+value+";expires="+exp.toGMTString();
        }
    }
};