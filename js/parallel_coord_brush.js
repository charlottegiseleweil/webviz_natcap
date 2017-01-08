  function parcoords_plot(){

  // quantitative color scale
  var blue_to_brown = d3.scale.linear()
    .domain([20, 50])                 //modular: get min/max of colored axis
    .range(["red", "steelblue"])
    .interpolate(d3.interpolateLab);

  var color = function(d) { 
    return blue_to_brown(d['sde_score']);
  };

  parcoords = d3.parcoords()("#parcoords_canvas")
      .color(color)
      .alpha(0.4);

  //Create Parallel Coordinates chart
  parcoords
      .data(full_data)
      .hideAxis(["sde_weight","sdl_weight", "awy_weight"])    //modular: names of hidden axis in the parcoord plot
      .composite("darker")
      .render()
      .shadows()
      .reorderable()
      .brushMode("1D-axes");  // enable brushing
  

  var sltBrushMode = d3.select('#sltBrushMode')

  sltBrushMode.selectAll('option')
    .data(parcoords.brushModes())
    .enter()
      .append('option')
      .text(function(d) { return d; });

// Pour sélectionner 5 different brush modes:
/*  sltBrushMode.on('change', function() {
    parcoords.brushMode(this.value);
    
    default:
      d3.select("#pStrums").style("visibility", "hidden");
      d3.select("#lblPredicate").style("visibility", "visible");
      d3.select("#sltPredicate").style("visibility", "visible");
      d3.select("#btnReset").style("visibility", "visible");
      break;
    }
  });*/

  sltBrushMode.property('value', '1D-axes');

  d3.select('#btnReset').on('click', function() {parcoords.brushReset();})

  d3.select('#sltPredicate').on('change', function() {
    parcoords.brushPredicate(this.value);
  });

  }