function scatterplots(data,nb_ticks){
    scatterplot('awy_score','sde_score','#scatterplot1', data ,nb_ticks);
    scatterplot('sde_score','sdl_score','#scatterplot2', data ,nb_ticks);
    scatterplot('sdl_score','awy_score','#scatterplot3', data ,nb_ticks);
}

function scatterplot(variable_x,variable_y,location,data_to_plot,nb_ticks){

    if (!nb_ticks){
        var nb_ticks = 0;
    }

    var margin = {top: 10, right: 10, bottom: 15, left: 20},
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
        .ticks(nb_ticks)
        .innerTickSize(4);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(nb_ticks)
        .innerTickSize(5);

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

//Update of the dots for corresponding fed data (data_to_plot)
    svg = d3.select(location).select('svg').select('g');     //selects the node 'g' which is the scatterplot

     /* Failed attempt to make tick checkbox
    svg.selectAll(".axis")
        .ticks(nb_ticks)
        .innerTickSize(5);*/

    //Frontier lines
    //TODO(chab) actually i think we can get of that, and do the sorting in the data-join (??)
    var data_by_frontier_id = [];
    data_to_plot.forEach(function(d){
        if (!data_by_frontier_id[d.frontier_id - 1]){
            data_by_frontier_id[d.frontier_id - 1] = [];
        }
        data_by_frontier_id[d.frontier_id - 1].push(d);
    });

    var line = d3.svg.line()
        .x(function(d) {return x(d[variable_x])})
        .y(function(d) {return y(d[variable_y])})
        .interpolate("linear");


    var cleanedData = [];
    data_by_frontier_id.forEach(function(d,i) {
        data_by_frontier_id[i].sort(function(a,b) { return (a[variable_x] - b[variable_x]) });
        cleanedData.push(data_by_frontier_id[i]);
    });

    var linesGroup = svg.selectAll('.frontier')
        .data(cleanedData, function(d,i) { if (d.length) return d[0].frontier_id});
    linesGroup.enter()
        .append('path')
        .classed('frontier', true);
    linesGroup.attr("d", line);
    linesGroup.exit().remove();

    //Connect the dots ----------
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

    dots.attr("r", 2)
        .attr("cx", function(d) { return x(d[variable_x]); })
        .attr("cy", function(d) { return y(d[variable_y]); })
        .style("fill", colorScat);
    dots.exit().remove();
}


var budget_levels = [625000000,1250000000,1875000000];
var colorscale_scatterplots = ['#fed98e','#fe9929','#d95f0e' , '#bdc9e1','#74a9cf','#0570b0'];


function colorScat(d){

    var colorscale = d['input_spat'] === 0 ? colorscale_scatterplots.slice(0,3) : colorscale_scatterplots.slice(3);
    var i = budget_levels.indexOf(d['input_budget'])
    return colorscale[i];
    /*
     console.log(d['input_spat']);
     console.log(d['input_budget']);
     if (d['input_spat'] === 0){
     var i = budget_levels.indexOf(d['input_budget']);
     return colorscale_o[i];
     }
     else if (d['input_spat'] === 1){
     var i = budget_levels.indexOf(d['input_budget']);
     return colorscale_b[i];
     }*/
}

//Legend
function scatterplotLegend(){

    var legend = d3.select("#scatterplot_legend")
        .append("svg")
        .attr("width", 60)
        .attr("height", 60)
        .attr("fill","black");


    legend.selectAll("rect").data(colorscale_scatterplots).enter()
        .append("rect")
        .attr("x", function(d,i){return (32 + Math.floor(i/3)*15)})  //20 if orange (0-2), 30 if blue (3-5)
        .attr("y", function(d,i){return (50-(i%3)*10)})
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d,i){ return colorscale_scatterplots[i] })
        .style("stroke",'black');

    legend.append("text")
        .attr("x",32)
        .attr("y",20)
        .text("A")
        .attr("fill","#d95f0e")

    legend.append("text")
        .attr("x",47)
        .attr("y",20)
        .attr("fill","#0570b0")
        .text("B")

    legend.append("text")
        .attr("x",0)
        .attr("y",20)
        .attr("fill","black")
        .style("font-size","9px")
        .style("text-orientation", "sideways-right")
        .text("Budget")

    legend.append("text")
        .attr("x",6)
        .attr("y",59)
        .attr("fill","black")
        .style("font-size","9px")
        .style("text-orientation", "sideways-right")
        .text("min")

    legend.append("text")
        .attr("x",5)
        .attr("y",40)
        .attr("fill","black")
        .style("font-size","9px")
        .style("text-orientation", "sideways-right")
        .text("max")

}

function scatterplot_highlight(d) {
    $(".id" + d.index).addClass("dot_highlight");
}

function scatterplot_unhighlight(d) {
    $(".id" + d.index).removeClass("dot_highlight");
}