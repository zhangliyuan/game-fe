var $ = require('teacher:components/common/base/base.js');

/**
 * @DESCRIPTION: Add style sheet to the document.
 * @PARAMETERS: cssRules{Object}: (Required) Css rules(formatted in object) to be added to the document.
 * @RETURN VALUE: No.
 * @EXAMPLE:
        addStyleSheet({
            '.desc': 'background:#999;',
            '.desc em': 'color:red;border:none;'
        });
 **/
module.exports = function(cssRules, id) {
    if($.type(cssRules) == 'object' && !$.isEmptyObject(cssRules)) {
        var rules = ['\n'];

        for(var ruleName in cssRules) {
            rules.push(ruleName, '{', cssRules[ruleName], '}\n');
        }
        if(document.createStyleSheet) {
            document.createStyleSheet().cssText = rules.join('');
        } else {
            var styleSheet = $('<style type="text/css"></style>');
            if ( id ) {
                $('#' + id).remove();
                styleSheet.attr('id', id);
            }
            styleSheet.append(rules.join('')).appendTo($('head')[0]);
        }
    }
};
