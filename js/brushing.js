<script id="brushing">// linear color scale
var blue_to_brown = d3.scale.linear()
  .domain([9, 50])
  .range(["steelblue", "brown"])
  .interpolate(d3.interpolateLab);

// interact with this variable from a javascript console
var pc1;

// load csv file and create the chart
d3.csv('examples/data/cars.csv', function(data) {
  pc1 = d3.parcoords()("#example1")
    .data(data)
    .hideAxis(["name"])
    .composite("darken")
    .color(function(d) { return blue_to_brown(d['economy (mpg)']); })  // quantitative color scale
    .alpha(0.35)
    .render()
    .brushMode("1D-axes")  // enable brushing
    .interactive()  // command line mode

  var explore_count = 0;
  var exploring = {};
  var explore_start = false;
  pc1.svg
    .selectAll(".dimension")
    .style("cursor", "pointer")
    .on("click", function(d) {
      exploring[d] = d in exploring ? false : true;
      event.preventDefault();
      if (exploring[d]) d3.timer(explore(d,explore_count));
    });

  function explore(dimension,count) {
    if (!explore_start) {
      explore_start = true;
      d3.timer(pc1.brush);
    }
    var speed = (Math.round(Math.random()) ? 1 : -1) * (Math.random()+0.5);
    return function(t) {
      if (!exploring[dimension]) return true;
      var domain = pc1.yscale[dimension].domain();
      var width = (domain[1] - domain[0])/4;

      var center = width*1.5*(1+Math.sin(speed*t/1200)) + domain[0];

      pc1.yscale[dimension].brush.extent([
        d3.max([center-width*0.01, domain[0]-width/400]),
        d3.min([center+width*1.01, domain[1]+width/100])
      ])(pc1.g()
          .filter(function(d) {
            return d == dimension;
          })
      );
    };
  };

});
</script>