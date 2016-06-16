var $ = require('components/lib/jquery/jquery.js');


module.exports = {
    parse: typeof JSON !== "undefined" ? JSON.parse : function(string) {
        if (typeof string !== "string" || !string) {
            return null;
        }
        string = $.trim(string);

        if (/^[\],:{}\s]*$/.test(string.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
            .replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {

            return (new Function("return " + string))();
        } else {
            throw "Invalid JSON: " + string;
        }
    },
    stringify: typeof JSON !== "undefined" ? JSON.stringify : function(obj) {
        var arr = [];
        $.each(obj, function(key, val) {
            var next = '"' + key + '":';
            if ( $.isPlainObject( val ) ) {
                next += $.json.stringify( val );
            } else {
                // 暂时只发现这几种类型, 如踩坑请补足;
                switch( $.type(val) ) {
                    case 'function': return true;
                    case 'string'  : next += '"' + val + '"'; break;
                    case 'boolean' :
                    case 'number'  : next += val; break;
                    case 'array'   : next += '[' + val.join(',') + ']'; break;
                    default        : throw "jQuery plugin json.stringify no " + $.type(val) + " type output!"; return true;
                };
            }
            arr.push(next);
        });
        return "{" + arr.join(",") + "}";
    }
};