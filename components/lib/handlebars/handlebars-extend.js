(function(Handlebars){
    Handlebars.registerHelper("xif", function(expression, options) {
        return Handlebars.helpers["x"].apply(this, [expression, options]) ? options.fn(this) : options.inverse(this);
    });
    Handlebars.registerHelper("x", function(expression, options) {
        var fn = function() {},
            result;

        // in a try block in case the expression have invalid javascript
        try {
            // create a new function using Function.apply, notice the capital F in Function
            fn = Function.apply(
                this, [
                    'window', // or add more '_this, window, a, b' you can add more params if you have references for them when you call fn(window, a, b, c);
                    'return ' + expression + ';' // edit that if you know what you're doing
                ]
            );
        } catch (e) {
            console.warn('[warning] {{x ' + expression + '}} is invalid javascript', e);
        }

        // then let's execute this new function, and pass it window, like we promised
        // so you can actually use window in your expression
        // i.e expression ==> 'window.config.userLimit + 10 - 5 + 2 - user.count' //
        // or whatever
        try {
            // if you have created the function with more params
            // that would like fn(a, b, c)
            result = fn.call(this, window);
        } catch (e) {
            console.warn('[warning] {{x ' + expression + '}} runtime error', e);
        }
        // return the output of that result, or undefined if some error occured
        return result;
    });

    Handlebars.registerHelper('compare', function(left, operator, right, options) {
         if (arguments.length < 3) {
           throw new Error('Handlerbars Helper "compare" needs 2 parameters');
         }
         var operators = {
           '==':     function(l, r) {return l == r; },
           '===':    function(l, r) {return l === r; },
           '!=':     function(l, r) {return l != r; },
           '!==':    function(l, r) {return l !== r; },
           '<':      function(l, r) {return l < r; },
           '>':      function(l, r) {return l > r; },
           '<=':     function(l, r) {return l <= r; },
           '>=':     function(l, r) {return l >= r; },
           'typeof': function(l, r) {return typeof l == r; }
         };

         if (!operators[operator]) {
           throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
         }

         var result = operators[operator](left, right);

         if (result) {
           return options.fn(this);
         } else {
           return options.inverse(this);
         }
     });
    
    Handlebars.registerHelper('escape', function( context ) {
        context = Handlebars.Utils.escapeExpression( context );
        return new Handlebars.SafeString( context );
    });

    Handlebars.registerHelper('dateFormat', function( date, format ) {

        return $.date.format(date, format);
    });


    //注册一个Handlebars Helper,用来将索引+1，因为默认是从0开始的
    Handlebars.registerHelper("addOne",function(index,options){
        return parseInt(index)+1;
    });
    //计算输出数组或字符串长度
    Handlebars.registerHelper("countArray",function(array,options){
        if(Object.prototype.toString.call(array)== '[object Array]'){
            return array.length;
        }else if(typeof(array)=='string'){
            return array.length;
        }
        return 0;
    });
    // 注册等式
    Handlebars.registerHelper("eq",function(v1,v2,options){
        if(v1==v2){
            //满足添加继续执行
            return options.fn(this);
        }else{
            //不满足条件执行{{else}}部分
            return options.inverse(this);
        }
    });
    // 注册不等式
    Handlebars.registerHelper("neq",function(v1,v2,options){
        if(v1!=v2){
            return options.fn(this);
        }else{
            return options.inverse(this);
        }
    });
    // 注册大于
    Handlebars.registerHelper("gt",function(v1,v2,options){
        if(v1>v2){
            return options.fn(this);
        }else{
            return options.inverse(this);
        }
    });
    // 注册小于
    Handlebars.registerHelper("lt",function(v1,v2,options){
        if(v1<v2){
            return options.fn(this);
        }else{
            return options.inverse(this);
        }
    });
})(Handlebars);