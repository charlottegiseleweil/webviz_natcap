/* global $, _, crossfilter, d3 */
(function (mcviz) {
	'use strict';

	var chartHolder = d3.select('#pie-plot');

	var margin = {top:20, right:20, bottom:20, left:50};
	var boundingRect = chartHolder.node()
		.getBoundingClientRect();
	var width = boundingRect.width - margin.left - margin.right;
	var height = boundingRect.height - margin.top - margin.bottom;
	var radius = Math.min(width, height) / 2;

	console.log('radius: '+radius);

    var arc = d3.svg.arc()
    	.outerRadius(radius-10)
    	.innerRadius(0);

    var pie = d3.layout.pie()
    	.sort(null)
    	.value(function(d){ return d });

    var svg = chartHolder.append('svg')
    	.attr('width', boundingRect.width)
    	.attr('height', boundingRect.height)
    	.append('g')
    		.attr('class', 'pie')
    		.attr("transform",  
    			"translate(" + (margin.left + width/2) + "," + (margin.top + height/2) + ")");

	mcviz.updatePiePlot = function(data, fields, colors) {
		var pieData = fields.map( n => data[n]+1 );

		var slices = svg.selectAll('path')
			.data(pie(pieData));

		slices.enter()
			.append('path')
			.style('fill', function(d,i) { return colors[fields[i]]; })
			.each(function(d) { this._current = d; });

		slices.exit().remove();
		
		slices = slices.data(pie(pieData));
		slices.transition()
			.duration(500)
			.attrTween('d', function(d) {
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t));
				};
			});


	};

}(window.mcviz = window.mcviz || {}));