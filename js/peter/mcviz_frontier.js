/* global $, _, crossfilter, d3 */
(function (mcviz) {
	'use strict';

	var chartHolder = d3.select('#frontier-plot');

	var margin = {top:20, right:20, bottom:30, left:30};
	var boundingRect = chartHolder.node()
		.getBoundingClientRect();
	var width = boundingRect.width - margin.left - margin.right;
	var height = boundingRect.height - margin.top - margin.bottom;


	// SCALES
	var xScale = d3.scale.linear()
					.range([0, width]);
	var yScale = d3.scale.linear()
					.range([0, height]);


	// AXES
	var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient('bottom')
					.ticks(5)
					.tickFormat(function(d) {
						return Math.round(d/1000000);
					});
	var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient('left')
					.ticks(5)
					.tickFormat(function(d) {
						return d;
					});

	var svg = chartHolder.append('svg')
		.attr('width', boundingRect.width)
		.attr('height', boundingRect.height)
		.append('g')
			.attr('class', 'chart')
			.attr('transform', 'translate('+margin.left+','+margin.top+')');
	svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,'+height+')');
	svg.append('g')
			.attr('class', 'y axis');


	mcviz.updateFrontierPlot = function(data) {
		var xrange = {
			min: d3.min(data, o=>o['xval']),
			max: d3.max(data, o=>o['xval'])
		};
		var yrange = {
			min: d3.min(data, o=>o['yval']),
			max: d3.max(data, o=>o['yval'])
		};

		xScale.domain([xrange.min, xrange.max]);
		yScale.domain([yrange.min, yrange.max]);

		var svg = d3.select('#frontier-plot .chart');

		svg.select('.x.axis')
			.transition().duration(300)
			.call(xAxis)

		svg.select('.y.axis')
			.transition().duration(300)
			.call(yAxis)

		var dots = svg.selectAll('.fdot')
				.data(data, function(d, i) {return i});

		dots.enter()
			.append('circle')
			.attr('pt', function(d, i){ return i;})
			.attr('class', 'fdot')
			.on('click', function(){
				dots.attr('class', 'fdot');
				d3.select(this)
					.attr('class', 'fdot active');
				mcviz.activePoint = d3.select(this).attr('pt');
				mcviz.newPointSelected();
			});
			// .attr('x', function(d) {return xScale(d['xval']);})
			// .attr('y', function(d) {return yScale(d['yval']);});

		dots.transition	()
			.duration(300)
			.ease('quad')
			.attr('cx', function(d) {return xScale(d['xval']);})
			.attr('cy', function(d) {return yScale(d['yval']);});

		dots.exit().remove();

	};

}(window.mcviz = window.mcviz || {}));






