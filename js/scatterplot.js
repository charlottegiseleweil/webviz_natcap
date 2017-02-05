function scatterplots(data){
      scatterplot('awy_score','sde_score','#scatterplot1', data);
      scatterplot('sde_score','sdl_score','#scatterplot2', data);
      scatterplot('sdl_score','awy_score','#scatterplot3', data);
};

function scatterplot(variable_x,variable_y,location,data_to_plot){


var margin = {top: 10, right: 10, bottom: 10, left: 20},
    width = 250 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom, 
    color = "blue";

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

//var color = d3.scale.category10(); //Color of the dots !

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(0); //Spécifier le nombre de ticks qu'on veut !

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(0);

  x.domain(d3.extent(full_data, function(d) { return d[variable_x]; })).nice();
  y.domain(d3.extent(full_data, function(d) { return d[variable_y]; })).nice();

//Creates scatterplot (do this part only the first time)
if (!d3.select(location).select('svg').node()) { //Checking if the scatterplot 'svg' doesn't exist

	var svg = d3.select(location).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 9)
      .style("text-anchor", "end")
      .text(variable_x);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -9)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(variable_y)

      }
//Update of the dots for corresponding fed data (data_to_plot)
  svg = d3.select(location).select('svg').select('g');     //selects the node 'g' which is the scatterplot
  var dots = svg.selectAll(".dot")
      .data(data_to_plot, function(d) { return d.index});
      dots.enter().append("circle").attr("class", "dot");
      dots.attr("r", 1.5)
          .attr("cx", function(d) { return x(d[variable_x]); })
          .attr("cy", function(d) { return y(d[variable_y]); })
          .style("fill", color);
      dots.exit().transition().duration(750).style('opacity', 0).remove();
};
