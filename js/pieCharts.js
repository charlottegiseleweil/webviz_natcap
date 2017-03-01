var pieSvg, pie, pieArc;

function initPiePlot(){

	var chartHolder = d3.select('#pie-chart');

	var margin = {top:0, right:0, bottom:0, left:0};
	var boundingRect = chartHolder.node()
		.getBoundingClientRect();
	var width = boundingRect.width - margin.left - margin.right;
	var height = boundingRect.height - margin.top - margin.bottom;
	var radius = Math.min(width, height) / 2;

    pieArc = d3.svg.arc()
    	.outerRadius(radius-10)
    	.innerRadius(0);

    pie = d3.layout.pie()
    	.sort(null)
    	.value(function(d){ return d });

    pieSvg = chartHolder.append('svg')
    	.attr('width', boundingRect.width)
    	.attr('height', boundingRect.height)
    	.append('g')
    		.attr('class', 'pie')
    		.attr("transform",  
    			"translate(" + (margin.left + width/2) + "," + (margin.top + height/2) + ")");
};

	 function renderPiePlot(data, colors) {
	 	var Land_cover_scale_interventions = ['#865f36','#6696ad','#7731ad','#4de060','#ef8741','#ea81c9'];
	 	//When generic: pull these from Land_cover_scale used in map.
		var fields = ['agroforestry_frac_area','riparian_mgmt_frac_area','terracing_frac_area','reforestation_frac_area','grass_strips_frac_area','road_mitigation_frac_area']
		var pieData = fields.map( n => data[n]);

		var slices = pieSvg.selectAll('path')
			.data(pie(pieData));

		slices.enter()
			.append('path')
			.style('fill', function(d,i) { return Land_cover_scale_interventions[i]; })
			.each(function(d) { this._current = d; });

		slices.exit().remove();
		
		slices = slices.data(pie(pieData));
		slices.transition()
			.duration(500)
			.attrTween('d', function(d) {
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return pieArc(interpolate(t));
				};
			});


	};