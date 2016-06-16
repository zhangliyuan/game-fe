exports.isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);

exports.isStrict = document.compatMode === "CSS1Compat";

if (/chrome\/(\d+\.\d)/i.test(navigator.userAgent)) {

    exports.chrome = +RegExp['\x241'];
}

if (/(msie\s|trident.*rv:)([\w.]+)/i.test(navigator.userAgent)) {

    exports.ie = document.documentMode || +RegExp['$2'];
}

if (/firefox\/(\d+\.\d)/i.test(navigator.userAgent)) {

    exports.firefox = +RegExp['\x241'];
}



exports.isWebkit = /webkit/i.test(navigator.userAgent);