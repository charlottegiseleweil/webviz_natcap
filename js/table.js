function table(data){

// create data table, row hover highlighting
var grid= d3.divgrid();
  d3.select("#table_canvas")
    .datum(data.slice(0,10))
    .call(grid)
    .selectAll(".row")
    .on({
      "mouseover": function(d) { 
          parcoords.highlight([d]);
           
      },
      "mouseout": parcoords.unhighlight
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

