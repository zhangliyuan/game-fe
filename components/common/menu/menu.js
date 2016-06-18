/*
 *	@Author: tomasran
 *	@Date: 2016-04-12 11:40:32
 *	@Last Modified by: tomasran
 */

/*
 *	@expamle:
 *		var menu = new Menu({
 *			'menuId': '',							// the most outside container id
 *			'menuClass': '',						// the mose outside container class
 *			'defaultSelected': {},					// default selected
 *			'onlyOneExpansion': true,				// only one list(include its parent's lists) expanded all the time
 *			'selectedFunc': function() {},			// callback when select one of the items
 *			'list':[{								// item data
 *				'id': '',
 *				'name': '',
 *				'content': '',
 *				'list': []
 *			}, {
 *				'id': '',
 *				'name': '',
 *				'content': '',
 *				'list': []
 *			}],
 *			'levelConfig': {						// configuration of each level(child inherited its parent)
 *				'1': {								// '1' represents the first level of the menu, and '2' for second level.. 
 *					'listClass': '',				// class of list
 *					'wrapClass': '',				// class of wrap element
 *					'itemClass': '',				// class of item
 *					'hoverClass': '',				// class of hover
 *					'selectedClass': '',			// class of item which is selected
 *					'selectEvent': '',				// the event triggering selected of one item
 *					'childExpandEvent': '',			// the event triggering expanded of item's sublist
 *					'childFoldEvent': '',			// the event triggering fold of item's sublist
 *					'position': '',					// the position relative to its parent
 *					'hideAfterSelected': ''			// whether disappeared when the item is selected
 *				},
 *				'2': {
 *				},
 *				...
 *			}
 *		});
 */

var $ = require('/components/common/base/base.js');
var uiClass = require('/components/common/class/class.js');

var createElement = function(tagName) {
	return $('<' + tagName + '>');
};

var isEmpty = function(data) {
	if (data == undefined || data == null || isNaN(data)) {
		return true;	
	}

	return false;
};

var extendObject = function(src, dest) {
	if (typeof dest !== 'object') {
		return null;
	}

	for (var prop in src) {
		if (src.hasOwnProperty(prop)) {
			if (dest[prop] === undefined) {
				dest[prop] = src[prop];
			}
		}
	}	
};

var coverBoolean = function(src, dest) {
	return dest === undefined ? src : getBoolean(dest);
};

var getBoolean = function(str) {
	return {
		'true': true,
		'false': false
	}[str];
};

var Menu = uiClass().extend({
	START_LEVEL: 1,
	LEVEL_STEP: 1,

	DEFAULT_HIDE_AFTER_SELECTED: false,
	DEFUALT_HIDE_AFTER_SELECTED_TIME: 50,

	DEFAULT_POSITION: 'bottom',

	ONLY_ONE_EXPANSION: true,
	DEFAULT_CHILD_EXPANSION: true,
	DEFAULT_CHILD_FOLD_EVENT: 'click',
	DEFAULT_CHILD_EXPAND_EVENT: 'click',
	DEFAULT_SELECT_EVENT: 'click',

	DEFAULT_MENU_CLASS: 'menu',
	DEFAULT_LIST_CLASS: 'list',
	DEFAULT_WRAP_CLASS: 'wrap',
	DEFAULT_ITEM_CLASS: 'item',
	DEFAULT_SELECTED_CLASS: 'selected',
	DEFAULT_HOVER_CLASS: 'hover',

	LIST_TAG: 'dl',
	WRAP_TAG: 'dt',
	ITEM_TAG: 'a',

	POSITION_SELECTOR: {
		'top': {
			'position':'absolute',
			'left': 0,
			'bottom': '100%' 
		},
		'bottom': {
			'position':'relative',
			'left': 0,
			'top': 0 
		},
		'right': { 
			'position':'absolute',
			'left': '100%',
			'top': 0
		},
		'left': { 
			'position':'absolute',
			'right': '100%',
			'top': 0
		}
	},

	init: function(options) {
		this.checkOptions(options);
		this.menu = createElement('menu');
		this.currentSelected = {};
	},

	getFilterString: function(option) {
		return '[data-id=' + option.id + '][data-level=' + option.level + ']';
	},

	// get specific list's level
	getListLevel: function(list) {
		var maxLevel = 1;
		var repeateCount = -1;

		for (var i = 0; i < list.length; i++) {
			if (list[i].list) {
				repeateCount++;
				maxLevel = maxLevel + this.getListLevel(list[i].list);
			}
		} 

		return maxLevel - Math.max(0, repeateCount);
	},

	getTotalLevel: function(list) {
		var arr = [];
		var baseLevel = 1;
		var temp = 0;

		for (var i = 0; i < list.length; i++) {
			if (list[i].list) {
				arr.push(this.getListLevel(list[i].list));
				temp = Math.max(temp, this.getListLevel(list[i].list));
			}	
		}	

		return baseLevel + temp;
	},

	// get specific level configuration
	getLevelConfig: function(i) {
		if (i == 0) {
			return {
				'position': this.DEFAULT_POSITION,
				'childExpansion': this.DEFAULT_CHILD_EXPANSION,
				'childExpandEvent': this.DEFAULT_CHILD_EXPAND_EVENT,
				'childFoldEvent': this.DEFAULT_CHILD_FOLD_EVENT,
				'selectEvent': this.DEFAULT_SELECT_EVENT,
				'selectedClass': this.DEFAULT_SELECTED_CLASS,
				'hideAfterSelected': this.DEFAULT_HIDE_AFTER_SELECTED,
				'hoverClass': this.DEFAULT_HOVER_CLASS,
				'listClass': this.DEFAULT_LIST_CLASS,
				'wrapClass': this.DEFAULT_WRAP_CLASS,
				'itemClass': this.DEFAULT_ITEM_CLASS
			};
		}

		return this.options.levelConfig[i + ''];
	},

	// whether has sublist
	hasSubList: function(target) {
		if (target.siblings(this.LIST_TAG).length === 0) {
			return true;
		} else {
			return false;	
		}
	},

	// complete levelConfig, child inherit parent
	completeLevelConfig: function() {
		for (var i = 1; i <= this.totalLevel; i++) {
			if (this.getLevelConfig(i) === undefined) {
				this.options.levelConfig[i + ''] = {};
			}

			extendObject(this.getLevelConfig(i-1), this.getLevelConfig(i));
		}
	},

	checkOptions: function(options) {
		this.options = $.extend({
			'selectedFunc': function() {}.bind(this),
			'list': [], 
			'levelConfig': {} 
		}, options);

		this.totalLevel = this.getTotalLevel(this.options.list);
		this.completeLevelConfig();
	},

	// get the data of selected menu item
	getSelectedItemData: function(item) {
		var data = [];
		var parentLists = item.parents(this.LIST_TAG);

		Array.prototype.pop.call(parentLists);

		var ceil = this.getItemData(item[0]);

		ceil.isLastLevel = this.hasSubList(item);
		data.push(ceil);

		if (parentLists.length !== 0) {
			$.each(parentLists, function(i, list) {
				var c = this.getItemData($(list).siblings()[0]);

				c.lsLastLevel = this.hasSubList($(list).siblings());
				data.push(c);
			}.bind(this));
		}

		return data;
	},
	
	// clear all selection
	clearSelection: function() {
		var lists = this.menu.find(this.LIST_TAG);

		$.each(lists, function(i, list) {
			var selectedClass = $(list).attr('data-selected-class');

			$(list).children().each(function() {
				var target = $(this).children(this.ITEM_TAG);

				target.removeClass(selectedClass);
			});
		});
	},

	// recursive selection
	recurseSelection: function(option) {
		var filterStr = this.getFilterString(option); 
		var target = this.menu.find(filterStr);

		if (target.length === 0) {
			return null;
		}

		var list = target.parent().parent();
		var parentTarget = list.siblings(this.ITEM_TAG);
		var selectedClass = list.attr('data-selected-class');
		var hideAfterSelected = getBoolean(list.attr('data-hide-after-selected'));

		if (hideAfterSelected) {
			setTimeout(function() {
				list.addClass('none');
			}, this.SELECTED_DISAPPEARED_TIME);
		};

		target.addClass(selectedClass);

		if (parentTarget.length === 0) {
			return null;
		} else {
			return this.recurseSelection({
				'id': parentTarget.attr('data-id'),
				'level': parentTarget.attr('data-level')
			});
		}
	},

	// select menu list
	select: function(option) {
		if (typeof option !== 'object') {
			return null;	
		}

		if (isEmpty(option['id'])  || isEmpty(option['level'])) {
			this.options.selectedFunc.call(this, null);
			return null;
		}

		var filterStr = this.getFilterString(option);
		var target = this.menu.find(filterStr);

		if (target.length === 0) {
			return null;
		}

		var selectedData = this.getSelectedItemData(target);

		this.currentSelected = selectedData[0];

		if (coverBoolean(this.ONLY_ONE_EXPANSION, this.options.onlyOneExpansion)) {
			this.handleExpansion();
		}

		this.clearSelection();
		this.recurseSelection(option);
		this.options.selectedFunc.call(this, selectedData);
	},

	// handle expansion when one of items is selected 
	handleExpansion: function() {
		var filterStr = this.getFilterString(this.currentSelected);

		$.each(this.menu.children().children(), function(i, item) {
			var target = $(item).find(filterStr);

			if (target.length === 0) {
				$(item).children(this.LIST_TAG).addClass('none');
			}
		}.bind(this));
	},

	// construct a sublist
	constructMenuList: function(levelConfig, parentLevelConfig) {
		var menuList = createElement(this.LIST_TAG).attr({
			'class': levelConfig.listClass,
			'data-selected-class': levelConfig.selectedClass,
			'data-hide-after-selected': levelConfig.hideAfterSelected,
		})[getBoolean(parentLevelConfig.childExpansion) ? 'removeClass' : 'addClass']('none');

		return menuList;
	},

	// construct a subitem 
	constructMenuItem: function(item, level, levelConfig) {
		var menuItem = createElement(this.WRAP_TAG).attr({
			'class': levelConfig.wrapClass
		}).css({
			'position': 'relative'
		});
		var menuItemContent = createElement(this.ITEM_TAG);

		menuItemContent.html(item.content).attr({
			'class': levelConfig.itemClass,
			'data-level': level
		}).appendTo(menuItem);

		this.setItemData(menuItemContent, item, ['list']);

		return menuItem;
	},

	setItemData: function(item, data, exceptArr) {
		var exceptMap = {};

		$.each(exceptArr, function(i, ea) {
			exceptMap[ea] = true;
		});

		for (var prop in data) {
			if (data.hasOwnProperty(prop)) {
				if (!exceptMap[prop]) {
					item.attr('data-' + prop, data[prop]);
				}
			}
		}
	},

	getItemData: function (item) {
		var data = {};
		var attrs = item.attributes;
		var reg = new RegExp('^data-*');	

		for(var prop in attrs) {
			if (attrs.hasOwnProperty(prop))	{
				if (reg.test(attrs[prop].name)) {
					var attr = attrs[prop].name.replace(reg, '');

					data[attr] = attrs[prop].value;
				}
			}
		}

		return data;
	},

	// set the menu list's relative position
	setMenuListPosition: function(position, target) {
		target.css(this.POSITION_SELECTOR[position]);
	},

	// consturct the whole menu
	constructMenu: function(list, level) {
		var levelConfig = this.getLevelConfig(level);
		var parentLevelConfig = this.getLevelConfig(level - 1);
		var menuList = this.constructMenuList(levelConfig, parentLevelConfig);

		$.each(list, function(i, item) {
			var menuItem = this.constructMenuItem(item, level, levelConfig).appendTo(menuList);

			this.bindHoverEvent(menuItem, levelConfig.hoverClass);
			if (item.list) {
				menuItem.append(this.constructMenu(item.list, level + this.LEVEL_STEP));
			}
		}.bind(this));

		this.setMenuListPosition(levelConfig.position, menuList);
		this.bindExpansionEvent(levelConfig, menuList);
		this.bindSelectionEvent(levelConfig, menuList);

		return menuList;
	},

	bindExpansionEvent: function(levelConfig, menuList) {
		var self = this;
		if (levelConfig.childExpandEvent === levelConfig.childFoldEvent) {
			menuList.children().on(levelConfig.childExpandEvent, function(e) {
				e.stopPropagation();
				$(e.target).siblings(self.LIST_TAG).toggleClass('none');
			});
		} else {
			menuList.children().on(levelConfig.childExpandEvent, function(e) {
				$(this).children(self.LIST_TAG).removeClass('none');
			});

			menuList.children().on(levelConfig.childFoldEvent, function(e) {
				$(this).children(self.LIST_TAG).addClass('none');
			});
		}
	},

	bindHoverEvent: function(target, hoverClass) {
		var self = this;

		target.on('mouseenter', function(e) {
			$(this).children(self.ITEM_TAG).addClass(hoverClass);
		}).on('mouseleave', function(e) {
			$(this).children(self.ITEM_TAG).removeClass(hoverClass);
		});
	},

	bindSelectionEvent: function(levelConfig, menuList) {
		var self = this;
		var target = menuList.children().children().filter(function() {
			return this.nodeName.toLowerCase() === self.ITEM_TAG;
		});						

		target.on(levelConfig.selectEvent, function(e) {
			if (this.nodeName.toLowerCase() === self.ITEM_TAG) {
				var data = self.getSelectedItemData($(this));

				self.select({
					'id': data[0].id,
					'level': data[0].level
				});
			}
		});
	},

	render: function() {
		var menuContent = this.constructMenu(this.options.list, this.START_LEVEL);

		this.menu.attr({
			'id': this.options.menuId,
			'class': this.options.menuClass || this.DEFAULT_MENU_CLASS
		});

		if (menuContent) {
			menuContent.appendTo(this.menu);
			this.select(this.options.defaultSelected);
		}

		return this.menu;
	},

	// update specific item's content
	updateContent: function(option, content) {
		var filterStr = '[data-id=' + option.id + '][data-level=' + option.level + ']';

		this.menu.find(filterStr).html(content);
	},

	reset: function(options) {
		this.options = options;
		this.checkOptions();
		this.menu.empty();
		this.render();
	}
});

module.exports = Menu;
