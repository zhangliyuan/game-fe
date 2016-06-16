


module.exports = {
    pad: function (number, length) {
        var len = length - ('' + Math.abs(number)).length + 1;
        return Array(len > 0 ? len : 0).join(0) + number;
    }
};