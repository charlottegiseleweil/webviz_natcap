/* global $, _, crossfilter, d3 */
(function (mcviz) {
	'use strict';

	var mapBox = d3.select('#map-box');

	var imgTag = mapBox.append('img')
		.attr('height', mcviz.mapHeight)
		.attr('width', mcviz.mapWidth);

	mcviz.updateMap = function(ptnum) {
		var imgPath = 'static/data/maps/landscape_'+ptnum+'.png';
		imgTag.attr('src', imgPath);
	};

}(window.mcviz = window.mcviz || {}));