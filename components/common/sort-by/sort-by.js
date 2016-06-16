/**
 * @author nuer
 * @time 20160105
 * @description 排序;
 */
var $ = require('teacher:components/common/base/base.js');

function parseProp ( obj, prop ) {
	prop = $.isArray(prop) ? prop : prop.split( '.' );
	if ( 1 === prop.length ) {
		return obj[ prop[0] ];
	}
	return parseProp( obj[ prop.shift() ], prop );
}

/**
 * @param  {Array} array
 * @param  {String} order 顺序
 * @return {Array}       排序后的结果
 * @example
 * sortBy([{a:2,b:{c:2}}, {a:1,b:{c:1}}], '-a');
 * sortBy([{a:2,b:{c:2}}, {a:1,b:{c:1}}], 'b.c');
 * sortBy([4,3,1,5,7], '-');
 */
module.exports = function ( array, order ) {
	if ( $.isEmptyObject( array ) ) {
		return array;
	}
	var sort;
	var orderIndex = /^-/.test(order) ? -1 : 1;
	if ( -1 === orderIndex ) {
		order = order.substring(1);
	}
	if ( $.isNumeric(array[0]) ) {
		sort = function ( a, b ) {
			return (a - b) * orderIndex;
		};
	} else {
		sort = function ( a, b ) {
			return (
				parseProp(a, order) - parseProp(b, order)
			) * orderIndex;
		};
	}
	return array.sort( sort );
};