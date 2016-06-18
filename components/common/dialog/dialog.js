/**
 * @author y.g.q
 * @time 20150515
 */


var $     	  = require('/components/common/base/base.js'),
	ec        = require('/components/common/event/event.js'),
	uiClass   = require('/components/common/class/class.js');
require('/components/lib/jquery.ui/dialog.js');
require('/components/lib/jquery.ui/effect-fade.js');
require('/components/lib/jquery.ui/effect-drop.js');





var _instances = {};

/**
 * @class Dialog
 * @description 弹窗
 * @example new Dialog(options)
 * @param 	{Object}			options
 * @config	{String|Element}	target			外部创建窗体，可为空
 * @config	{String}			width			窗体宽度
 * @config	{String}			closeText		关闭窗体按钮文字描述
 * @config 	{Boolean}			draggable		窗体拖动
 * @config  {String}			dialogClass		窗体最外层className（有高优先级）
 * @config	{String}			btnAlign		按钮位置（left | center | right）
 * @config	{Object}			show			窗体打开时动画
	 * @config	{String}		effect 			效果，参见 components/lib/jquery.ui/effect*.js
	 * @config	{String}		direction		出现位置
 * @config	{Object}			hide			窗体关闭时动画
	 * @config	{String}		effect 			效果，参见 components/lib/jquery.ui/effect*.js
	 * @config	{String}		direction		出现位置
 * @config	{Function}			beforeClose		
 */
var Dialog = uiClass().extend({
	init: function(options) {
		var me = this;
		options = $.extend({
			modal: true,
			width: '480px',
			closeText: '关闭',
			resizable: false,
			draggable: true,
			dialogClass: options.className,
			btnAlign: 'center',
			show: {
				effect: "fade"
			},
			hide: {
				effect: "fade"
			},
			beforeClose: function() {
				$(window).unbind('resize', Resize);
			}
		}, options || {});

		if ( !options.target ) {
			me.instance = $('<div>', {
				id: 'ks-dlg-' + me.guid
			}).html(options.content).dialog(options);
		} else {
			me.instance = $(options.target).dialog(options);
		}
		if ($.isArray(options['buttons'])) {
			me.customBttons(options['buttons']);
		}
		me.instance.next().css('text-align', options['btnAlign']);

		if (options.autoDispose) {
			me.instance.on('dialogclose', function() {
				$(this).dialog('destroy').remove();
				delete _instances[me.guid];
			});
		}

		_instances[me.guid] = me.instance;

		function Resize() {
			if ( me ) {
				me.center();
				me.isTop();
			}
		}

		$(window).on('resize', Resize);
	},
	customBttons: function(buttons) {
		var me = this,
			btnBox = this.instance.next().children('div'),
			btnArr = btnBox.find('button');
		$(buttons).each(function(index) {
			var bThas = this;
			if (!this['className'] && index < 2) {
				this['className'] = ['btn-38-white', 'btn-38-white'][index] + ' mr-10';
			}
			$('<a href="#" />').text(this.text || '')
				.appendTo(btnBox).addClass(this['className'] || '')
				.click(function(e) {
					e.preventDefault();
					bThas.click.apply(me.instance, arguments);
				});
		});
		btnArr.remove();
	},
	open: function() {
		this.instance.dialog('open');
	},
	close: function() {
		this.instance.dialog('close');
	},
	isTop: function() {
		var dig = this.instance.parent();
		if ( parseInt(dig.css('top')) < 0 ) {
			dig.css( 'top', 0 );
		}
	},
	center: function() {
		this.instance && 
		this.instance.dialog &&
		this.instance.dialog('option', 'position', {
			my: 'center',
			at: 'center',
			of: window
		});
	},
	getDialogContainer: function() {
		return this.instance.dialog('widget');
	},
	/*
	 * @param {Object} size
	 * @config {Number} size.width
	 * @config {Number} size.height
	 */
	setSize: function(size) {
		this.instance.dialog('option', size);
	},
	setTitle: function(title) {
		if (title) {
			this.instance.dialog('option', 'title', title);
		}
	}
});

ec.on('dialog.close', function() {
	Dialog.close();
});


module.exports = $.extend(Dialog, {
	'alert': function(content, options) {
		// 这里是个坑, 一旦dialog高度超过浏览器会影响到窗口跳到底部, 时间紧迫从简解决;
		var scrollbar,
			options = $.extend(true, {
				title: '提示',
				content: content,
				autoDispose: true,
				buttons: [{
					'text': '确定',
					'click': function() {
						$.isFunction(options.onaccept) && options.onaccept.apply(this, arguments);
						$(this).dialog("close");
					}
				}],
				open: function() {
					// var uiDialog = $( this ).parent();
					// setTimeout(function(){
					// 	scrollbar = new ScrollBar({
					// 		container: uiDialog
					// 	});
					// 	$(window).height() < uiDialog.height()
					// 		&& scrollbar.to(-1);
					// }, 600);
				},
				close: function() {
					scrollbar && scrollbar.destroy();
				}
			}, options);
		return new Dialog(options);
	},
	'confirm': function(content, options) {
		options.buttons = options.buttons || [{
			'text': '确定',
			'click': function() {
				$.isFunction(options.onaccept) && options.onaccept.apply(this, arguments);
			}
		}, {
			'text': '取消',
			'click': function() {
				$.isFunction(options.oncancel) && options.oncancel.apply(this, arguments);
				$(this).dialog("close");
			}
		}];
		return Dialog.alert(content, options);
	},
	'iframe': function(options) {
		var content = '<iframe frameborder="no" class="ui-dialog-content-iframe" src="' + options.content + '"></iframe>';
		options.content = content;
		if (!options.buttons) {
			options.buttons = [];
		}
		options.dialogClass = 'dialog-iframe';
		return Dialog.alert(content, options);
	},
	'close': function() {
		$.each(_instances, function(guid, _instance) {
			try {
				_instance && _instance.dialog('close');
			} catch (e) {}
		});
	}
});
