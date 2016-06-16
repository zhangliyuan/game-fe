/**
 * @author nuer
 * @time 20130816
 */

var $ = require('teacher:components/common/base/base.js');



var cache = {};

function resize( target, width, height, errFn, align ) {

	return $( target ).each(function() {
		if ( !$(this).is('img') ) {
			return;
		}
		var $this   = $( this ).hide(),
			_width  = width || $this.attr('width'),
			_height = height || $this.attr('height'),
			_align  = align || $this.attr('align') || 'center',
			src 	= $this.data('src') || $this.attr('src'),
			key 	= 'img_' + (++$.guid);

		errFn = $.isFunction( errFn ) ? errFn : function(e) {
			this.remove();
		};

		if (cache[src]) {
			return $this.css( getSize(cache[src], _width, _height, _align) ).attr({
				src: cache[ src ].src
			}).show();
		}
		function load() {
			cache[ src ] = {
				width: this.width,
				height: this.height,
				src: this.src
			};
			var id = $this.attr( 'id' ) || key;
			$this.after( this ).remove();
			$( this ).css( getSize(cache[src], _width, _height, _align) ).show();
			this.id = id;
			_clearTmp( this, key );
		}

		var img = new Image();
		window[key] = img;
		img.src = $.url.setParam(src, 'k', key);
        if ( img.complete ) {
            load.apply( img );
        } else {
            img.onload = load;

            img.onerror = function( e ) {
                errFn.call( $this, e );
                _clearTmp( this, key );
            };
        }

	});
}

function _clearTmp( tmp, tmpKey ) {
	tmp.onload = tmp.onerror = null;
	window[ tmpKey ] = null;
	tmp = null;
}

function getSize( img, w, h, align ) {
	var ih = img.height,
		iw = img.width;

	if ( iw > 0 && ih > 0 ) {

		var scare = Math.min( w / iw, h / ih );
		scare = scare > 1 ? 1 : scare;

		var ret = {
			width: iw * scare,
			height: ih * scare
		};

		align == 'center' && $.extend(ret, {
			marginLeft: ( w - (iw * scare) ) / 2,
			marginTop: ( h - (ih * scare) ) / 2
		});

		return ret;
	}
	return {};
}

$.fn.imgResize = function( width, height, errFn, align ) {
	return resize( this, width, height, errFn, align );
};

module.exports = {
	resize: resize,
	getSize: getSize
};
