
module.exports = {
	remove: function( arr, condition ) {
		var len = arr.length, iterator = condition;

        if (typeof condition != 'function') {
            iterator = function (item) {
                return condition === item;
            };
        }

        while ( len-- ) {
            if (true === iterator.call(arr, arr[len], len)) {
                arr.splice( len, 1 );
            }
        }
        return arr;
	},
	unique: function (array) {
        var list = [], o = {}, i, l = array.length;
        for (i = 0; i < l; o[array[i]] = array[i++]);

        for (i in o) list.push(o[i]);
        return list;
    }
};
