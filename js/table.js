function table(data){

// create data table, row hover highlighting
// If you want only a subset of the data: .datum(data.slice(0,10))

var grid= d3.divgrid();
  d3.select("#table_canvas")
    .datum(data)
    .call(grid)
    .selectAll(".table_row")
    .on({
      "mouseover": function(d) { 
        
          scatterplot_highlight(d);
          parcoords.highlight([d]);
          
      },
      "click": function(d) { 
        
          parcoords.highlight([d]);
          scatterplot_highlight(d);

          //here: todo - show corresponding map + map statistics (+ pie plots for weights and land cover)
          choose_map('singleSol',d);
          map(); //just to render map
          renderPiePlot(d);
          
      },
      "mouseout": function(d) {
        parcoords.unhighlight([d]);
        scatterplot_unhighlight(d);
    }

    });

}

