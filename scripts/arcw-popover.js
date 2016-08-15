var arwpTmpl = '<li><a href="{{href}}">{{title}}</a></li>';

var ArcwPopover = function () {
	var self = this;
	this.links = jQuery('.has-posts a');
	this.calendars = jQuery('.calendar-archives');

	self._popover();
};

ArcwPopover.prototype._setContent = function (elem) {
	var cal = jQuery(elem.data('cal')),
		data = elem.data('content'),
		container = cal.data('popover').find('#arcwp-content'),
		list = jQuery('<ul></ul>');

	data.posts.forEach(function (item) {
		list.append(arwpTmpl.replace('{{href}}', item.permalink).replace('{{title}}', item.title));
	});
	if(data.more){
		list.append(jQuery(arwpTmpl.replace('{{href}}', elem.attr('href')).replace('{{title}}', data.more + ' >')).addClass('arcwp-more'))
	}
	container.html(list);
};

ArcwPopover.prototype._loading = function (elem) {
	var self = this,
		cal = elem.data('cal'),
		popover = cal.data('popover'),
		container = cal.data('popover').find('#arcwp-content');
	container.html('<span class="loading"><span class="loader"></span></span>');
};

ArcwPopover.prototype._setError = function (elem) {
	var self = this,
		cal = elem.data('cal'),
		container = cal.data('popover').find('#arcwp-content');
	container.html('<span class="arcwp-error">Error</span>');
};


ArcwPopover.prototype._popover = function () {
	var self = this;

	self.calendars.each(function (index, elem) {
		var popover = jQuery('<div class="arcw-popover"><div id="arcwp-arrow"></div><div id="arcwp-content"></div></div>'),
			$elem = jQuery(elem);
		$elem.append(popover);
		$elem.data('popover', popover);
	});
};

ArcwPopover.prototype.hide = function (elem) {
	var cal = elem.data('cal');
	cal.removeClass('hover');
};
ArcwPopover.prototype._show = function (elem) {
	var self = this,
		cal = elem.data('cal'),
		popover = cal.data('popover');

	cal.addClass('hover');

	var offset = cal.offset();
	var elmpos = elem.offset();

	popover.css({
		top: elmpos.top - offset.top + elem.outerHeight(),
		left: elmpos.left - offset.left - 75 + elem.width() / 2
	})
};


ArcwPopover.prototype.popover = function (elem) {
	var self = this;

	if (!elem.data('cal'))
		elem.data('cal', elem.parents('.calendar-archives'));

	self._show(elem);

	if (elem.data('content')) {
		self._setContent(elem);
		return;
	}
	var link = elem.attr('href'),
		date = elem.attr('data-date');

	self._loading(elem);

	self._getPosts(link, date)
		.done(function (response) {
			var data = JSON.parse(response);
			if (data.posts.length) {
				elem.data('content', data);
				self._setContent(elem);
			}
		})
		.fail(function () {
			self._setError(elem);
		});
};


ArcwPopover.prototype._getPosts = function (link, date) {
	var self = this,
		data = {
			'action': 'get_archives_list',
			'link': link,
			'date': date
		};

	return jQuery.ajax({
		url: ajaxurl,
		method: 'POST',
		data: data,
		async: true
	});
};

jQuery(function ($) {
	var arcwp = new ArcwPopover();

	$('.calendar-archives .has-posts a').on('mouseenter', function () {
		var elem = $(this);
		arcwp.popover(elem);
	}).on('mouseleave', function () {
		var elem = $(this);
		arcwp.hide(elem);
	});

});