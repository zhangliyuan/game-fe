/**
 * Ajax调用公共方法
 * @Vencent
 * @DateTime  2015-12-15T11:25:34+0800
 */
var $ = require('components/common/base/base.js');
var tip = require('components/common/pop-tip/pop-tip.js');

// 是否锁定状态
var _lock={};
/**
 * Ajax请求基类
 * @type {Object}
 */
var Base={
	getUUID:function(){
	    var s = [];
	    var hexDigits = "0123456789abcdef";
	    for (var i = 0; i < 36; i++) {
	        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	    }
	    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
	    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
	    s[8] = s[13] = s[18] = s[23] = "-";
	 
	    var uuid = s.join("");
	    return uuid;
	},
	getRequestId: function() {
		return $.hashCode.value( Base.getUUID() ) & 0x7fffffff;
	},
	getRequestURL:function(url){
		return '/game' + url;
	},
	/**
	 * 是否当前请求接口锁定
	 * @DateTime 2015-12-15T14:24:51+0800
	 * @param    {string}                 lock_id 锁定ID
	 * @return   {boolean}                        是否锁定
	 */
	isLock:function(lock_id){
		if(_lock[lock_id]){
			return true;
		}else{
			return false;
		}
	},
	/**
	 * 接口加锁 仅用于锁定某个接口的重复调用 但如果相同接口不同参数 也会锁定
	 * @DateTime 2015-12-15T14:28:49+0800
	 * @param    {string}                 lock_id 锁定的接口唯一标识
	 * @return   {null} 
	 */
	lock:function(lock_id){
		_lock[lock_id]=true;
	},
	/**
	 * 解锁
	 * @DateTime 2015-12-17T09:41:39+0800
	 * @param    {string}                 lock_id 接口唯一标识
	 * @return   {null}
	 */
	unlock:function(lock_id){
		_lock[lock_id]=false;
	},

	/**
	 * Ajax请求处理
	 * @DateTime 2015-12-15T13:40:01+0800
	 * @param    {obj}                 opt     {url,type,data,lock,beforeSend,success,error,custom}
	 * @param    {function}                 success 成功
	 * @param    {function}                 error   错误callback
	 * @return   {null}
	 */
	ajax:function(opt){
		opt=$.extend({
			type:'GET', //默认GET
			lock:false,		//默认不锁定接口
			custom:null,
			beforeSend:null
		},opt);

		// 判断是否锁定了接口
		if(opt.lock){
			if(Base.isLock(opt.url)){
				return false;
			}
			Base.lock(opt.url);
		}
		// 数据提交
		var ajaxObj=$.ajax({
			url: Base.getRequestURL(opt.url), //配置URL
			type:opt.type,	//传送方式 默认GET
			dataType:'json',
			data:opt.data,
			headers: {
				requestid:Base.getRequestId(),
				'is_new_okay': 1
			},
			beforeSend: opt.beforeSend,
			success:function(result){
				// 解锁
				opt.lock && Base.unlock(opt.url);
				// 数据处理
				if(result.code==0){
					if(typeof(opt.success)=='function'){
						var _rt=opt.success(result.data,opt.custom);
						// 如果该方法返回值有效
						if(typeof(_rt)!='undefined' && _rt){
							//默认行为
							result.msg && tip(result.msg);
						}
					}else{
						//默认行为
						result.msg && tip(result.msg);
					}
				}else if(result.code==3995){
					tip(result.msg||'请重新登陆');
					// 登陆失效后 重新刷新当前页面
					window.location.reload();
				}else{
					if(typeof(opt.error)=='function'){
						var _rt=opt.error(result.msg,result.code,opt.custom);
						// 如果该方法返回值有效
						if(typeof(_rt)!='undefined' && _rt){
							//默认行为
							tip(result.msg||'操作失败');
						}
					}else{
						//默认错误输出行为
						tip(result.msg||'操作失败');
					}
				}
			},
			error:function(xhr, status){
				// 解锁
				opt.lock && Base.unlock(opt.url);
				if(status=="abort"){
					return;
				}
				// 根据status判定错误类型
				if(typeof(opt.error)=='function'){
					var _rt=opt.error('网络错误',status,opt.custom);
					// 如果该方法返回值有效
					if(typeof(_rt)!='undefined' && _rt){
						//默认行为
						tip('网络错误 '+status);
					}
				}else{
					//默认错误输出行为
					tip('网络错误 '+status);
				}
			}
		});
		return ajaxObj;
	},

	/**
	 * POST提交数据 支持post(url,success,error,lock) 方式 
	 * @DateTime 2015-12-21T11:36:02+0800
	 * @param    {[string]}                 url     请求地址
	 * @param    {[obj]}                 data    传参
	 * @param    {[function]}                 success 成功返回
	 * @param    {[function]}                 error   失败返回
	 * @param    {[boolean]}                 lock    是否锁定
	 * @return   {[null]}                         
	 */
	post:function(url,data,success,error,lock){
		if(url){
			var opt={
				url:url,
				type:'POST'
			};
			var _len = arguments.length,
				_sta = 1;
			if(_len>1){
				var _type=typeof(arguments[1]);
				if(_type=='object'){
					opt.data=arguments[1];
					_sta = 2;
				}
				// 成功
				if(typeof(arguments[_sta])=='function'){
				 	opt.success=arguments[_sta];
				}
				if(typeof(arguments[_sta+1])=='function'){
					opt.error=arguments[_sta+1];
				}
				if(typeof(arguments[_sta]+2)=='boolean'){
					opt.lock=arguments[_sta+2];
				}
			}
			return Base.ajax(opt);
		}
		return false;
	},
	/**
	 * GET获取数据 支持get(url,success,error,lock) 方式 
	 * @DateTime 2015-12-21T11:36:02+0800
	 * @param    {[string]}                 url     请求地址
	 * @param    {[obj]}                 data    传参
	 * @param    {[function]}                 success 成功返回
	 * @param    {[function]}                 error   失败返回
	 * @param    {[boolean]}                 lock    是否锁定
	 * @return   {[null]}     
	 */
	get:function(url,data,success,error,lock){
		if(url){
			var opt={
				url:url,
				type:'GET'
			};
			var _len = arguments.length,
				_sta = 1;
			if(_len>1){
				var _type=typeof(arguments[1]);
				if(_type=='object'){
					opt.data=arguments[1];
					_sta = 2;
				}
				// 成功
				if(typeof(arguments[_sta])=='function'){
				 	opt.success=arguments[_sta];
				}
				if(typeof(arguments[_sta+1])=='function'){
					opt.error=arguments[_sta+1];
				}
				if(typeof(arguments[_sta]+2)=='boolean'){
					opt.lock=arguments[_sta+2];
				}
			}
			return Base.ajax(opt);
		}
		return false;
	}
}

module.exports=Base;