var ArcwPopover = function () {
	var self = this;
	this.links = jQuery('.has-posts a');
	this.calendars = jQuery('.calendar-archives');

	self._popover();
};

ArcwPopover.prototype._setContent = function (elem) {
	var self = this,
		cal = jQuery(elem.data('cal'));
	cal.data('popover').html(elem.data('content'));
};

ArcwPopover.prototype._loading = function (elem) {
	var self = this,
		cal = elem.data('cal'),
		popover = cal.data('popover');
	popover.html('<span class="loading"><span class="loader"></span></span>');
};

ArcwPopover.prototype._setError = function (elem) {
	var self = this,
		cal = elem.data('cal');
	cal.data('popover').html('<span class="arcwp-error">Error</span>');
};

ArcwPopover.prototype._popover = function () {
	var self = this;

	self.calendars.each(function (index, elem) {
		var popover = jQuery('<div class="arcw-popover"></div>'),
			$elem = jQuery(elem);
		$elem.append(popover);
		$elem.data('popover', popover);
	});
};

ArcwPopover.prototype.hide = function(elem) {
	var cal = elem.data('cal');
	cal.removeClass('hover');
};
ArcwPopover.prototype._show = function(elem) {
	var self = this,
		cal = elem.data('cal'),
		popover = cal.data('popover');

	cal.addClass('hover');

	var offset = cal.offset();
	var elmpos = elem.offset();

	popover.css({
		top: elmpos.top - offset.top + elem.outerHeight(),
		left: elmpos.left - offset.left - 75 + elem.width()/2
	})
};


ArcwPopover.prototype.popover = function(elem) {
	var self = this;

	if (!elem.data('cal'))
		elem.data('cal', elem.parents('.calendar-archives'));

	self._show(elem);

	if (elem.data('content')) {
		self._setContent(elem);
		return;
	}
	var link = elem.attr('href');

	self._loading(elem);

	self._getPosts(link)
		.done(function (response) {
			elem.data('content', response);
			self._setContent(elem);
		})
		.fail(function () {
			self._setError(elem);
		});
};


ArcwPopover.prototype._getPosts = function (link) {
	var self = this,
		data = {
			'action': 'get_archives_list',
			'link': link
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
	}).on('mouseleave', function(){
		var elem = $(this);
		arcwp.hide(elem);
	});

});