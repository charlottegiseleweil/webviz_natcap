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


//----------------------------------------------------------------------------------------
// DRAFT ! Color coding corresponding to parametric uncertainty combo

// Goal : si deux solutions ont les mêmes valeurs de chaque pu paramètres (i.e y'a que leurs wieghts qui changent) :display same color
var num_pu_combos = 3*3*2*4;
// En fait: 72 combo, donc on va juste faire colorscale sur 1 ou 2 parametres, je vais explorer le data et regarder lesquels font le + sens
// CHALLENGING : Comment repérer quel dot corresponds à quelle sol (trier pu_param sur col esm_case).

//var color = d3.scale.category10(); 

//----------------------------------------------------------------------------------------

//Update of the dots for corresponding fed data (data_to_plot)
  svg = d3.select(location).select('svg').select('g');     //selects the node 'g' which is the scatterplot
  var dots = svg.selectAll(".dot")
      .data(data_to_plot, function(d) { return d.index});


    // There could be an issue with this flow
    // n  dots - 0 dots - 1 dot. The thing is that when we remove all the dots, we schedule a transition
    // so the dot will 'still be there', and removed from the DOM later.. this leads to a situation
    // when we call .data again, the circle is still there d3 will ask us to update a circle that is going
    // to be removed from the DOM.. so the trick is to stop all transitions on circles that are going
    // to be updated, so they will not be removed.

  dots.enter()
  .append("circle")
  .attr("class", function(d) {
    return 'dot' + " id" + d.index; 
  })
  dots.attr("r", 1.5)
      .attr("cx", function(d) { return x(d[variable_x]); })
      .attr("cy", function(d) { return y(d[variable_y]); })
      .style("fill", color);
  dots.exit().remove();
};

function scatterplot_highlight(d) {
 $(".id" + d.index).addClass("dot_highlight");
};

function scatterplot_unhighlight(d) {
 $(".id" + d.index).removeClass("dot_highlight");
};