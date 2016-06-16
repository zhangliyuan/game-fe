/**
 * @author y.g.q
 * @time 20141008
 */


var $ = require('components/common/base/base.js');


function _create( target ){
	var ec = $(target);
	$.extend(target, {
		on: function(name, fn){
			ec.on( _getEvtName(name), fn);
			return target;
		},
		once: function(name, fn){
			ec.one( _getEvtName(name), fn);
			return target;
		},
		fire: function(name, fn){
			var arr = Array.prototype.slice.call(arguments, 1);
            arr.unshift( _getEvtName(name) );
			ec.trigger.apply(ec, arr);
			return target;
		},
		off: function(name, fn){
			ec.unbind( _getEvtName(name), fn);
			return target;
        },
        events: function( name ) {
            var jQueryExpando = ec[ 0 ][ $.expando ];
            if ( !jQueryExpando ) {
                return ;
            }
            var array  = [],
                events = jQueryExpando.events,
                rtype  = /^([^.]*)(?:\.(.+)|)$/,
                tmp    = rtype.exec(_getEvtName(name) ) || [],
                type   = tmp[ 1 ],
                // jQuery处理方式, 保持一致性;
                namespaces = ( tmp[2] || "" ).split( "." ).sort().join('.');

            $.each(events[ type ] || [], function() {
                if ( namespaces === this.namespace ) {
                    array.push( this );
                }
            });
            return array;
        }
	});

	target.un = target.off;
	target.trigger = target.fire;
	return target;
}

function _getEvtName( name ){
	return 'on' + name.replace(/^on/i,'').toLowerCase();
}


module.exports = _create({});
module.exports.create = _create;
