/**
 * Loading Status
 * @Vencent
 * @DateTime 2016-01-07T13:35:54+0800
 * @example 
 * loading=new load();
 * load.show(); //默认在body
 * load.show($page); // 在指定的$page容器内
 * load.show($page,'fixed'); //在指定容器内 强制临时定位fixed
 * load.setOption({}).show(); 链式操作
 */

var $ = require('/components/common/base/base.js'); 

/**
 * New 初始化配置参数
 * @param    {Obj}                 opt 配置参数 具体参看内部
 */
module.exports = function(opt){
	opt=$.extend({
		'warp':null,		// 初始化配置容器 也可以Show时候传 或这默认加载至 body
		'class':"wgt-loading-mask",	// 自定义样式
		'background-color':"rgba(255,255,255,0.5)",		// 自定义背景色 默认白色 可以设置为空
		'innerHtml':'',		// 自定义添加loading内部html
		'position':null,	// 定义loading组件的定位规则 优先级最高 空则自动判断
		'max-height':0,		// 配置最大高度 支持px(默认) em rem vh vw %
		'min-height':0		// 配置最小高度 支持px(默认) em rem vh vw %
	},opt);
	// 生成HTML
	function getHtml(){
		var style="";
		style+=opt['background-color']?('background-color:'+opt['background-color']+';'):'';
		var minH=parseInt(opt['min-height']);
		style+=(minH && minH>0)?('min-height:'+getUnit(opt['min-height'])+';'):'';

		return '<div class="wgt-loading '+opt.class+'" style="display:none;'+style+'">'+opt.innerHtml+'</div>';
	}
	// 是否已经配置单位
	function getUnit(val){
		var reg=/(px|em|rem|vw|vh|%)$/ig;
		if(reg.test(val)){
			return val;
		}else{
			// 默认单位px
			return parseInt(val)+'px';
		}
	}
	// 复位css
	function resetStyle($warp){
		var style=$warp.data('data-style');
		// 判断当前是否隐藏
		var show=$warp.is(':visible');
		var reg=/display:[a-z]+;/ig;
		if(!show && reg.test(style)){
			style=style.replace(reg,'display:none;');
		}
		if(style){
			$warp.attr('style',style);
		}else{
			$warp.removeAttr('style');
		}
	}

	// 内部变量
	var loadHtml=getHtml();
	var $warp=opt.warp;

	var Base={
		/**
		 * 显示Loading
		 * @param    {jObj}                 $lwarp  loading组件所在容器 可以为空默认加载到body
		 * @param    {string}               loadPos 临时配置loading 的position 默认走配置
		 */
		show:function($lwarp,loadPos){
			// 获取容器
			$warp=$lwarp?$lwarp:($warp || $('body'));
			// 配置style
			var style=$warp.attr('style');
			if(style){
				$warp.data('data-style',style);
			}
			
			// 判断当前定位
			var lPos=loadPos?loadPos:(opt.position?opt.position:'absolute');
			var pos=$warp.css('position');
			if($.inArray(pos,['absolute','relative','fixed'])==-1 && opt.position!="fixed" && lPos!="fixed"){
				$warp.css('position','relative');
			}
			// 清理原有的loading
			var $l=$warp.children('.wgt-loading').remove();
			// 配置warp高度
			if(pos=='fixed' && opt['max-height'] && parseInt(opt['max-height'])>0){
				$warp.css({
					height:getUnit(opt['max-height']),
					overflow:'hidden'
				});
			}
			$(loadHtml).css('position',lPos).appendTo($warp).fadeIn();
			return this;
		},
		/**
		 * 隐藏Loading
		 * @param    {jObj}                 $lwarp 容器（可选）
		 */
		hide:function($lwarp,hideFun){
			$warp=$lwarp?$lwarp:($warp || $('body'));
			var $l=$warp.children('.wgt-loading');
			if($l.length){
				$l.stop(true).fadeOut(function(){
					$(this).remove();
					resetStyle($warp);
					typeof(hideFun)=='function' && hideFun($warp);
				});
			}else{
				resetStyle($warp);
				typeof(hideFun)=='function' && hideFun($warp);
			}
			return this;
		},
		/**
		 * 配置
		 * @Vencent
		 * @param    {obj}                 _opt 参考配置信息
		 */
		setOption:function(_opt){
			opt=$.extend(opt,_opt);
			loadHtml=getHtml();
			return this;
		}
	}
	return Base;
}