/**
 * @author nuer
 * @time 20151217
 */
(function() {
	var F = {};
	var _data = {};
	F.data = function(key, value) {
		var length = arguments.length;
		if (length > 1) {
			_data[key] = value;
		} else if (length == 1) {
			if (typeof key == 'object') {
				for (var k in key) {
					if (key.hasOwnProperty(k)) {
						_data[k] = key[k];
					}
				}
			} else {
				return _data[key];
			}
		}
	};
	'F' in window || (window.F = F);
})();