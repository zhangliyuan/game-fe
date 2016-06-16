/**
 * @author nuer
 * @time 20151217
 */

var $ = require('components/lib/jquery/jquery.js');


//TODO: BROWSER;
$.browser = require('./browser.js');

//TODO: URL;
$.url = require('./url.js');

//TODO: STRING;
$.string = require('./string.js');

//TODO: NUMBER;
$.number = require('./number.js');

//TODO: JSON;
$.json = require('./json.js');

//TODO: cookie;
$.cookie = require('./cookie.js');

//TODO: date;
$.date = require('./date.js');

//TODO: array;
$.array = require('./array.js');

//TODO: hashcode;
$.hashCode = require('./hashcode.js');


var escapeMap = {
    "<": "&#60;",
    ">": "&#62;",
    '"': "&#34;",
    "'": "&#39;",
    "&": "&#38;"
};
var escapeFn = function (s) {
    return escapeMap[s];
};
var escapeHTML = function ( content ) {
    return 'string' === $.type( content ) ? content.replace(/&(?![\w#]+;)|[<>"']/g, escapeFn) : content;
};

$.extend({
    bool: function( str ) {
        return ( /^true$/i ).test( str );
    },
    escapeHTML: escapeHTML
});

if ( !Function.prototype.bind ) {
    Function.prototype.bind = function() {
        var that = this,
            args  = Array.prototype.slice.call( arguments ),
            obj   = args.shift();
        return function() {
            that.apply(obj, args);
        };
    };
}




module.exports = $;
