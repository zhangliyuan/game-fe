/*多柱状图*/
var $ = require('/components/common/base/base.js'); 

/*设计思路，
拿到数据，
做处理，
渲染模板，
判断长度来设置项数的高度和之间的外边距
*/
//数据,

//数据模板
//对象数据,特殊情况处理，颜色选取
//
/*2、3、4通过传参，项名宽度、项高度和项之间的间距
5-10父类的高度和宽度进行等比处理
*/
main={
	$div:null,
	//初始化数据过滤
	init:function(option,dataTmpl,call){
		this.$div = option;
		var _thas = this;
		//加载外层模板
		/*var $html = '<div class="multiColumnar"></div>';*/
		//容器清空操作
		_thas.$div.html('<div class="multiColumnar"></div>');
		//校验传输数据
		if(typeof dataTmpl=='undefined'){
			console.log('传输数据格式错误！');
		}else{
			//检测是否需要特定颜色值
			if(dataTmpl.color==undefined){
				dataTmpl.color = ['#13c859','#f75106'];
			}
			var array = new Array();
			var optionTitle = new Array();
			$.each(dataTmpl.data,function(m,n){
				//console.log(m);
				//校验备用
				optionTitle.push(_thas.getByteLen(n.name));
				array.push(n.number);
			})
			var max = Math.max.apply(null, array);
			var optionTitleLen = Math.max.apply(null, optionTitle);
			_thas.manageData(dataTmpl,max,optionTitleLen,call);
		}
		
	},
	//判断字符串的长度
	getByteLen:function(val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            var a = val.charAt(i);
            (a.match(/[^\x00-\xff]/ig) != null)?len += 2:len += 1;
        }
        return len;
    },
	manageData:function(item,max,titleLen,call){
		var _thas = this;
		//拼接数据，渲染模板，输出模板
		$.each(item.data,function(m,n){
			//模板比较简单，即前半部分和后半部分
			//前半部分为选项、和选项人数
			//后半部分需要计算，求数组中最大值最为100%，其他的宽度值为该项数比上最大项
			//如果数据全为0的时候，即max=0
			if(max == '0'){
				n.percent = 0;
			}else{
				n.percent=parseFloat(n.number*100/max).toFixed(1);
				((n.percent=='100.0')||(n.percent=='0.0'))?n.percent= parseFloat(n.number*100/max)+'%':n.percent=n.percent+'%';
			}

			console.log(n.percent);
			//颜色值,做扩展使用，默认值
			(n.result==1)?n.color=item.color[0]:n.color=item.color[1];
		})
		_thas.RenderingTmpl(item,titleLen,call);
	},
	RenderingTmpl:function(data,titleLen,call){
		var _thas = this;
		//暂用js代替，之后写入模板中
		$.each(data.data,function(m,n){
			//var $width= (window.innerWidth -100)+'px';
			var $html='<div class="line">'
			+'<div class="option-bth" data-value="'+n.name+'" >'+n.name+'<span>'+n.number+'人</span></div>'
			+'<div class="progressbar_1"><div class="bar" data-value="'+n.name+'" style="width:'+n.percent+'; background-color:'+n.color+'"></div></div>'
			+'</div>';
			_thas.$div.children('.multiColumnar').append($html);
		})
		//设置项名统一宽度
		var getDivFontSize=_thas.$div.children('.multiColumnar').css("font-size");
		var optionTitleLenght=(titleLen/2+3)*parseFloat(getDivFontSize , 10)+'px';
		$('.multiColumnar .option-bth',_thas.$div).css("width",optionTitleLenght);
		//设置项的宽度
		var calcset = "calc(100% - " +optionTitleLenght+ " - 20px)";
		$('.progressbar_1',_thas.$div).css({"width":calcset});
		//特殊行数处理
		var flag=true;
		if(data.special){
			
			for(var i=0;i<data.special.length;i++){
				if(data.data.length==data.special[i]){
					_thas.renderingSpecial(data,data.special[i]);
					flag=false;
				}
			}
			
		}
		//判断对象是否为空
		function isEmptyObject(obj){
		    for(var n in obj){
		    	return true;
		    } 
		    return false; 
		}
		//判断是否是对象，是否是空对象
		var isObject = isEmptyObject(data.parameter)&&(data.parameter.height!='')&&(data.parameter.margin!='');
		if((typeof data.parameter === "object")&&(isObject)){
			flag=false;
			//自定义高度和间距方法
			_thas.renderingSelf(data);
		}
		
		//项数等比处理
		if(flag){
			_thas.renderingAuto(data,data.data.length);
		}
		//回调
		$('.multiColumnar .line',_thas.$div).on('click', '.option-bth', function( e ) {
			e.preventDefault();
			//console.log(this.dataset.value);
			/*call(this.firstChild);*/
			//call(this.dataset.value);
			$(this).parent().parent().find('.option-bth').css('border','1px solid #d9d9d9');
			$(this).css('border','1px solid #0095f1');
			call($(this).data('value'));
		});
		$('.multiColumnar .line',_thas.$div).on('click', '.progressbar_1 .bar', function( e ) {
			e.preventDefault();
			//console.log(this.dataset.value);
			//call(this.dataset.value);
			$(this).parent().prev().parent().parent().find('.option-bth').css('border','1px solid #d9d9d9');
			$(this).parent().prev().css('border','1px solid #0095f1');
			call($(this).data('value'));
		});	

	},
	/*renderingSpecial:function(data,num){
		console.log(num+'行');
		//采用定义好的样式替换即可
	},*/
	renderingSelf:function(data){
		var _thas = this;
		//采用自定义处理
		console.log('自定义处理：高度'+data.parameter.height);

		//处理字体过小问题
		var getDivFontSize=_thas.$div.children('.multiColumnar').css("font-size");
		if(parseFloat(data.parameter.height , 10) < parseFloat(getDivFontSize , 10)){
			$('.multiColumnar .option-bth',_thas.$div).css('font-size',data.parameter.height);
		}
		//var marginValue = data.parameter.margin +' auto';
		$('.multiColumnar .line',_thas.$div).css('margin-bottom',data.parameter.margin);
		var $BthHeight = parseFloat(data.parameter.height , 10) - 2 + 'px';
		$('.multiColumnar .option-bth',_thas.$div).css({"height":$BthHeight,"line-height":$BthHeight});
		$('.multiColumnar .line',_thas.$div).css("height",data.parameter.height);
		$('.multiColumnar .progressbar_1',_thas.$div).css("height",data.parameter.height);
		$('.multiColumnar .progressbar_1 .bar',_thas.$div).css("height",data.parameter.height);
		//掐头去尾
		
		$('.multiColumnar .line',_thas.$div).first('div:last').css('margin-top','0px');
		$('.multiColumnar .line',_thas.$div).last('div:last').css('margin-bottom','0px');
		//居中处理：获取当前ul里面的高度，在其父容器中/居中展示
		var parentHeight = _thas.$div.children('.multiColumnar').parent().height();
		var ULHeight = _thas.$div.children('.multiColumnar').height();
		var newUlHeight = -ULHeight/2 + 'px';
		if(ULHeight < parentHeight){
			_thas.$div.children('.multiColumnar').css({"position":"relative","top":"50%","margin-top":newUlHeight});
		}

	},
	renderingAuto:function(data,num){
		var _thas = this;
		//符合一定的算法 
		console.log(num+'auto行');
		var parentHeight = _thas.$div.children('.multiColumnar').parent().height();
		var $height='';
		var $margin='';
		var $BthHeight ='';
		/*项数范围10以内，等比例计算
		*/
		if(num <= 10){
			//项目数+2*margin = 父容器的高度
			//方程式：从4到10 推出
			//4： 33 32；10： 24 2
			//已知H(父高度)，X(项目数)，h(高度)，m(边距)
			//方程1：Xh + (X-1)m = H;
			//方程2：h = 0.3m + 23.4;
			//解得：m = (H-23.4X)/(1.3X-1)
			//带入方程2，即得h
			$margin = ((parseFloat(parentHeight , 10) - 23.4*num)/(1.3*num - 1)).toFixed(2);
			$height = (0.3*$margin+23.4).toFixed(2);
			$BthHeight = $height - 2 + 'px';
			$margin = $margin +'px';
			$height = $height + 'px';
		}else{
			//其他情况等比例处理
			//parseFloat('10px' , 10)   10
			//少减1，避免五入情况
			$height = ((parseFloat(parentHeight , 10)-num)/num).toFixed(2);
			$BthHeight = $height - 2 + 'px';
			$height = $height + 'px';
			$margin = '1px';

		}
		//处理数据
		var getDivFontSize=_thas.$div.children('.multiColumnar').css("font-size");
		if(parseFloat($height , 10) < parseFloat(getDivFontSize , 10)){
			$('.multiColumnar .option-bth',_thas.$div).css('font-size',$height);
		}
		//var marginValue = $margin +' auto';
		$('.multiColumnar .line',_thas.$div).css('margin-bottom',$margin);
		
		$('.multiColumnar .option-bth',_thas.$div).css({"height":$BthHeight,"line-height":$BthHeight});
		$('.multiColumnar .progressbar_1',_thas.$div).css("height",$height);
		$('.multiColumnar .progressbar_1 .bar',_thas.$div).css("height",$height);

		$('.multiColumnar .line',_thas.$div).css("height",$height);
		//去尾
		/*$('.multiColumnar .line').first('div:last').css('margin-top','0px');*/
		$('.multiColumnar .line',_thas.$div).last('div:last').css('margin-bottom','0px');
		console.log(_thas.$div.children('.multiColumnar').height());
	}
};
module.exports =  main;