var $ = require('components/common/base/base.js');



module.exports = function(string, options) {
    var options = $.extend({
        delay:2e3
    }, options);
    $("#pop-layer-box").remove();
    var elem = $("<div />").prop({
            id: "pop-layer-box"
        }).css({
            "position"        : "absolute",
            "z-index"         : "9999",
            "background-color": "#45494d",
            "color"           : "#fff",
            "font-size"       : "12px",
            "padding"         : "15px 30px",
            "border-radius"   : "3px"
        }).html( string ).appendTo(document.body),
        top  = $(window).height() / 2 + $(window).scrollTop() - 130,
        left = ($(window).width() - elem.width() - 60) / 2;
    top  = top > 50 ? top : 50;
    left = left >= 0 ? left : 0;
    elem.css({
        left   : left + "px",
        top    : top + "px",
        opacity: 0
    }).animate({
        top: top - 25,
        opacity: 1
    }, 200);
    setTimeout(function() {
        elem.animate({
            top: top,
            opacity: 0
        }, 200, function() {
            elem.remove();
            options.callback && options.callback();
        })
    }, options.delay);
};