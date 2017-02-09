function table(data){

// create data table, row hover highlighting
// If you want only a subset of the data: .datum(data.slice(0,10))

var grid= d3.divgrid();
  d3.select("#table_canvas")
    .datum(data)
    .call(grid)
    .selectAll(".row")
    .on({
      "mouseover": function(d) { 
        
          parcoords.highlight([d]);
          scatterplot_highlight(d);
      },
      "click": function(d) { 
        
          parcoords.highlight([d]);
          scatterplot_highlight(d);

          //here: todo - show corresponding map + map statistics (+ pie plots for weights and land cover)
          //Problem is we don't find choose_map fct
          choose_map('singleSol',d);
          
      },
      "mouseout": function(d) {
        parcoords.unhighlight;
        scatterplot_unhighlight(d);
    }

    });


  // update data table upon parcoords brush event
  parcoords.on("brush", function(d) {
    d3.select("#table_canvas")
      .datum(d.slice(0,10))
      .call(grid)
      .selectAll(".row")
      .on({
        "mouseover": function(d) { parcoords.highlight([d]) },
        "mouseout": parcoords.unhighlight
      });
    });

}

