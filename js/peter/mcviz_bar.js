/* global $, _, crossfilter, d3 */
(function (mcviz) {
	'use strict';

	var chartHolder = d3.select('#bar-plot');

	var margin = {top:20, right:20, bottom:20, left:20};

	var boundingRect = chartHolder.node()
		.getBoundingClientRect();
	var width = boundingRect.width - margin.left - margin.right;
	var height = boundingRect.height - margin.top - margin.bottom;
	var xPaddingLeft = 10;

	// SCALES
	var xScale = d3.scale.ordinal()
					.rangeBands([xPaddingLeft, width], 0.1);
	var yScale = d3.scale.linear()
					.range([height, 0]);

	var svg = chartHolder.append('svg')
		.attr('width', boundingRect.width)
		.attr('height', boundingRect.height)
		.append('g').classed('chart', true)
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


	mcviz.updateBarChart = function(data) {
		var maxVal = Math.max(...data);
		var minVal = Math.min(...data);
		var dataRange = maxVal - minVal;

		xScale.domain(data);
		yScale.domain([minVal, maxVal]);

		var svg = d3.select('#bar-plot .chart');
		var bars = svg.selectAll('.bar')
					  .data(data, function(d,i) { return i; });
		bars.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('height', 0)
			.attr('y', height);

		bars.attr('width', xScale.rangeBand())
			.attr('x', function(d){return xScale(d); })
			.transition()
			.duration(300)
			.ease('quad')
				.attr('height', function(d) { return height - yScale(d); })
				.attr('y', function(d) { return yScale(d); });

		bars.exit()
			.transition()
			.duration(300)
			.ease('quad')
				.attr('height', 0)
				.attr('y', height)
				.remove();
	};
}(window.mcviz = window.mcviz || {}));




