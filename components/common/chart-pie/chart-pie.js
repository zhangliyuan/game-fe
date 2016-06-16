var $ = require('components/common/base/base.js');

/* * for example:
 * var pieChart = new PieChart({
 *	'className': '',							//环形图类名
 *	'relativePos': 'left',						//环形图相对于描述的位置
 *	'graph': {
 *		'className',							//类名
 *		'strokeColor': '#eee',					//边框颜色
 *		'strokeWidth': 10,						//边框宽度
 *		'space': 2,								//不同颜色环之间间隔的角度
 *		'flipX': false,							//是否关于X轴翻转
 *		'flipY': false							//是否关于Y轴翻转
 *		'outsideR': 100,						//外径
 *		'insideR': 80,							//内径
 *		'rotation': 30,							//旋转角度
 *		'title': {								//环形图标题
 *			'className': '',					//类名
 *			'content': '<span>80%</span>'		//标题内容
 *		},
 *		'slices': [{							//分片数组
 *			'color': '#eee',
 *			'percent': 0.1,
 *			'name': 'a'
 *		}, {
 *			'color': '#fff',
 *			'percent': 0.2,
 *			'name': 'b'
 *		}],
 *		'clickCallback': null,					//点击slice分片响应的回调
 *		'mouseOverCallback': null,				//鼠标移动到分片响应的回调
 *		'mouseOutCallback': null				//鼠标离开分片响应的回调
 *	},
 *	'description': {
 *		'className': '',						//整个描述部分的类名
 *		'items': [{								//描述部分
 *			'content': '<span></span>',			//描述内容
 *			'className': '',					//每个描述按钮的类名
 *			'name': 'a'							//唯一标识
 *		}, {
 *			'desc': '<span></span>',
 *			'name': 'b'
 *		}],
 *		'callback': null						//点击description响应的回调
 *	}
 * });
 *
 */

// 默认颜色分配
function allotColor(i) {
	var colorPool = ['E32322', 'EA621F', 'F18E1C', 'FDC60B', 'F4E500', '8CBB26', '008E5B', '0696BB', '2A71B0', '444E99', '6D398B', 'C4037D'];
	return '#' + colorPool[i % colorPool.length];
};

// 事件委托
function eventEntrust(pNode, eventType, childNodeName, callback) {
	pNode.on(eventType, function(e) {
		var e = e || window.event;
		var target = e.target || event.srcElement;
		
		if (target.nodeName.toUpperCase() === childNodeName.toUpperCase()) {
			var name = $(target).attr('data-name');
			if (name) {
				callback ? callback(name) : null;
			}
		}
	});
}

// 环形图组件生成器
var pieChartGenerator = {
	svg: {
		createElement: function(tagName) {
			return $(document.createElementNS('http://www.w3.org/2000/svg', tagName));
		},

		getSectionalPath: function(startAngle, stopAngle, insideR, outsideR) {
			var startRadian = startAngle * Math.PI / 180;
			var stopRadian = stopAngle * Math.PI / 180;	
	
			var startAngleTri = {
				cos: Math.cos(startRadian),
				sin: Math.sin(startRadian)
			};

			var stopAngleTri = {
				cos: Math.cos(stopRadian),
				sin: Math.sin(stopRadian)	
			};

			return ['M', insideR * startAngleTri.cos, insideR * startAngleTri.sin,
			'A', insideR, insideR,
			0,
			Math.abs(stopRadian - startRadian) > Math.PI ? 1 : 0,
			1, insideR * stopAngleTri.cos, insideR * stopAngleTri.sin,
			'L', outsideR * stopAngleTri.cos, outsideR * stopAngleTri.sin,
			'A', outsideR, outsideR,
			0,
			Math.abs(stopRadian - startRadian) > Math.PI ? 1 : 0,
			0, outsideR * startAngleTri.cos, outsideR * startAngleTri.sin,
			'Z'].join(' ');
		},

		getGraph: function(config) {
			// 环形图最外层容器
			var graph = $(document.createElement('div')).attr({
				'class': config.className || ''
			}).css({
				'position': 'relative',
				'width': config.outsideR * 2
			});

			// 环形图标题
			if (config.title) {
				var titleWidth = 2 * Math.sqrt(Math.pow(config.insideR, 2) / 2);
				$(document.createElement('p')).html(config.title.content).attr({
					'class': config.title.className || ''
				}).css({
					'margin': 0,
					'width': titleWidth + 'px',
					'height': titleWidth + 'px',
					'line-height': titleWidth + 'px',
					'position': 'absolute',
					'margin-left': -(titleWidth / 2) + 'px',
					'margin-top': -(titleWidth / 2) + 'px',
					'left': '50%',
					'top': '50%',
					'text-align': 'center'
				}).appendTo(graph);
			}

			// 构造svg
			var svg = pieChartGenerator.svg.createElement('svg').css({
				'width': config.outsideR * 2 + 'px',
				'height': config.outsideR * 2 + 'px'
			}).appendTo(graph);
	
			// 构造组面板
			var transform = 'translate(' + config.outsideR + ',' + config.outsideR + ') rotate(' + config.rotation + ') scale(' + (config.flipY ? '-1': '1') + ',' + (config.flipX ? '-1' : '1') + ')';
			var graphPanel = pieChartGenerator.svg.createElement('g').attr({
				'transform': transform
			}).appendTo(svg);
	
			// 构造分片
			var startAngle = 0;
			
			// 如果传入的slices为空
			if (config.slices && config.slices.length === 0) {
				pieChartGenerator.svg.createElement('path').attr({
					'd': pieChartGenerator.svg.getSectionalPath(0, 360, config.insideR, config.outsideR),
				}).css({
					'fill': '#d9d9d9',
					'stroke': '#d9d9d9',
					'strokeWidth': 1
				}).appendTo(graphPanel);
			}

			// 如果不为空
			$.each(config.slices, function(i, item) {
				var stopAngle = item.angle === 0 ? startAngle : (item.angle === 360 ? 360 : startAngle + item.angle - config.space);
				pieChartGenerator.svg.createElement('path').attr({
					'd': pieChartGenerator.svg.getSectionalPath(startAngle, stopAngle, config.insideR, config.outsideR),
					'data-name': item.name,
					'data-angle': item.angle
				}).css({
					'fill': item.color || allotColor(i),
					'stroke': config.strokeColor || item.color || allotColor(i),
					'strokeWidth': config.strokeColor ? config.strokeWidth : 0,
					'cursor': config.clickCallback ? 'pointer' : 'auto'
				}).appendTo(graphPanel);
					startAngle += item.angle;
			});	
			
			config.clickCallback ? eventEntrust(svg, 'click', 'PATH', config.clickCallback) : null;
			config.mouseOverCallback ? eventEntrust(svg, 'mouseover', 'PATH', config.mouseOverCallback) : null;

			config.mouseOutCallback ? eventEntrust(svg, 'mouseout', 'PATH', config.mouseOutCallback) : null;

			return graph;
		}
	}
};

// 参数检测，初始化
function argsCheck(args) {
	this.args = args;

	this.args.graph = $.extend({
		'strokeWidth': args.strokeWidth || 1,
		'space': 0,
		'outsideR': 0,
		'insideR': 0,
		'rotation': 0,
		'slices':[{
			'percent': 1
		}]
	}, args.graph);

	this.args.description = args.description;

	$.each(this.args.graph.slices, function(i, item) {
		item.angle = (item.percent || 0) * 360;
	});
};

// 构造描述部分
function createDesc(config) {
	if (config) {
		var descPanel = $(document.createElement('ul')).attr({
			'class': config.className || ''
		}).css({
			'padding': 0,
			'margin': 0,
			'overflow': 'hidden'
		});

		$.each(config.items, function(i, item) {
			$(document.createElement('li')).attr({
				'data-name': item.name,
				'class': item.className
			}).css({
				'display': 'block',
				'float': 'left',
				'cursor': config.callback ? 'pointer' : 'auto',
				'overflow': 'hidden',
				'position': 'relative'
			}).on('click', function() {
				config.callback ? config.callback(item.name) : null;
			}).html(item.content).appendTo(descPanel);
		});
		
		return descPanel;
	}
};

function PieChart(args) {
	argsCheck.call(this, args);

	// todo: support vml
	this.graphEngine = 'svg';

	var self = this;

	this.getPieChart = function() {
		if (self.el) {
			return self.el;
		}

		var graph = pieChartGenerator[self.graphEngine].getGraph(self.args.graph);
		var desc = createDesc(self.args.description);
		var combine = [];

		switch(self.args.relativePos) {
			case 'left':
				graph.css({'float': 'left'});
				desc.css({'float':'right'});
				combine.push(graph, desc);
				break;
			case 'right': 
				graph.css({'float': 'right'});
				desc.css({'float':'left'});
				combine.push(desc, graph);
				break;
			case 'top':
				combine.push(graph, desc);
				break;
			case 'bottom':
				combine.push(desc, graph);
				break;
			default:
				break;
		};

		self.el = $(document.createElement('div')).attr({
			'class': self.args.className
		}).css({
			'display': 'inline-block'
		}).append(combine);

		return self.el;
	};
};

PieChart.prototype = {
	constructor: PieChart,

	getHTML: function() {
		return this.getPieChart().html();
	},

	getNode: function() {
		return this.getPieChart();
	},

	fresh: function(data) {
		if (!data) {
			return null;
		}

		var self = this;
		var graph = self.args.graph;
		var paths = self.el.find('path');
		var slices = {};

		// 刷新标题
		if (data.title) {
			data.title.content ? $(self.el.find('p')).html(data.title.content) : null;
		}

		// 刷新饼图部分（只能刷新饼图各个分片的大小）
		$.each(data.slices, function(i, slice) {
			slices[slice.name] = {
				'angle': slice.percent * 360,
				'color': slice.color
			};	
		});

		var startAngle = 0;
		// 刷新已经存在的分片
		$.each(paths, function(i, path) {
			var name = $(path).attr('data-name');

			if (name) {
				var angle = slices[name] === undefined ? parseFloat($(path).attr('angle')) : slices[name].angle;
				var stopAngle = angle === 0 ? startAngle : (angle === 360 ? 360 : startAngle + angle - graph.space);

				$(path).attr({
					'd': pieChartGenerator.svg.getSectionalPath(startAngle, stopAngle, graph.insideR, graph.outsideR),
					'data-angle': angle
				});	

				startAngle += angle;
				delete slices[name];
			} else {
				$(path).attr({
					'd': pieChartGenerator.svg.getSectionalPath(0, 0, graph.insideR, graph.outsideR),
				});	
			}
		});

		// 添加新增加的分片
		for (var prop in slices) {
			if (slices.hasOwnProperty(prop)) {
				var stopAngle = startAngle + slices[prop].angle;
				pieChartGenerator.svg.createElement('path').attr({
					'd': pieChartGenerator.svg.getSectionalPath(startAngle, stopAngle, graph.insideR, graph.outsideR),
					'data-name': prop,
					'data-angle': slices[prop].angle
				}).css({
					'fill': slices[prop].color || allotColor(i),
					'stroke': graph.strokeColor || slices[prop].color || allotColor(i),
					'strokeWidth': graph.strokeColor ? graph.strokeWidth : 0,
					'cursor': graph.clickCallback ? 'pointer' : 'auto'
				}).appendTo(self.el.find('g'));
				startAngle += slices[prop].angle;
			}
		}

		// 刷新描述部分（只刷新每个描述item的内容部分）
		$.each(data.items, function(i, item) {
			$(self.el.find('li[data-name='+ item.name + ']')).html(item.content);
		});
	}
};

module.exports = PieChart;
