var pieSvg, pie, pieArc, pieTooltip;

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

    // construct the tooltip div
    pieTooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .text('tooltip');
};

function renderPiePlot(data, colors) {
	 	var Land_cover_scale_interventions = ['#865f36','#6696ad','#7731ad','#4de060','#ef8741','#ea81c9'];
	 	//When generic: pull these from Land_cover_scale used in map.
		var interventions = ['agroforestry_frac_area','riparian_mgmt_frac_area','terracing_frac_area','reforestation_frac_area','grass_strips_frac_area','road_mitigation_frac_area'];
		var interventionsNames = ['Agroforestry','Riparian management','Terracing','Reforestation','Grass strips','Road mitigation'];
		var pieData = interventions.map( n => data[n]);

		var slices = pieSvg.selectAll('path')
			.data(pie(pieData));

		slices.enter()
			.append('path')
			.style('fill', function(d,i) { return Land_cover_scale_interventions[i]; })
			.attr('class', 'pie-slice')
            .on("mouseover", function(d, i){
                var pctVal = (100*(d['endAngle']-d['startAngle'])/
                              (2*Math.PI)).toPrecision(3);
                pieTooltip.html(interventionsNames[i] + '<br />' +
                    (d['value'].toFixed(2))*100 + ' % <br />'); //éventuellement ajouter npix
                return pieTooltip.style("visibility", "visible");
            })
            .on("mousemove", function(){return pieTooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", function(){return pieTooltip.style("visibility", "hidden");})
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
