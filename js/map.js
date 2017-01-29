var colorScale;

function map(){

    var legend_height = 337; //chosen same height as map


// continuous scale
var startColor = d3.rgb("#123456");
var endColor = d3.rgb("#900041");

// categorical scale
var Land_cover_scale =[[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
    ["#003366",'#a6c8e3',"#00336f",'#f6c8e3','#a6cee3','#1f78b4','#b2df8a','#33a02c','#b2df86','#33002c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'],
    ["Grass","Forest","Road","Land","Dry forest","introduced grassland","Sand","Barren","Woods","Grass green","Forest","Big forest","Awesome forest","Water","Unicorn","Agroforestry","Sand","Moutain","Superurban","Urban"]];

  //number of legend categories
  var num_legend_boxes = Land_cover_scale[0].length; 
  // legend box size
  var ls_w = legend_height/num_legend_boxes, ls_h = legend_height/num_legend_boxes;


var baseRaster;

var ext, newExt, image, rasters, canvas, ctx;

var map_upon_toggle = "./data/testlulc.tif"; //map to display initially

$('#map_toggle').change(function(e) {
      if ($(this).prop('checked')) {
        map_upon_toggle = "./data/test_obj.tif";
        render_map();
        } else {
        map_upon_toggle = "./data/testlulc.tif";
        render_map();
        }
    })

render_map();

function render_map() {
    d3.xhr(map_upon_toggle)
    .responseType('arraybuffer')
    .get(function(error, data){
        var parser = GeoTIFF.parse(data.response);
        image = parser.getImage();
        rasters = image.readRasters();
        canvas = document.getElementById('map_canvas');
        ctx = canvas.getContext("2d");
        // there is some arbitrary value fow 'no data', that messes all my calculations
        baseRaster = rasters[0];
        ext = d3.extent(baseRaster);
        newExt = d3.extent(baseRaster.filter(function(r){ return r != ext[0]; }));
        console.log( "IN render map:", newExt);
        

      
      if ($('#map_toggle').prop('checked')) {

            render_continuous();
            //var Continuous_scale = TODO row 1: 10 categories from newExt
            //                            row 2: colorScale
            //                            row 3: labels
            //render_legend_continuous();        
            } else {
            render_categorical();
            render_legend_categorical();
        }

    });    
}

function render_continuous() {
    colorScale = d3.scale.linear().domain(newExt).range([startColor.toString(), endColor.toString()]);
    console.log("colorScale:" , colorScale, newExt);
    var imageData = ctx.createImageData(image.getWidth(), image.getHeight());
    var color_data = imageData.data;

    var o = 0;
    baseRaster.forEach(function(r){
        if (r === ext[0]) {
            color_data[o] = 255;
            color_data[o+1] = 255;
            color_data[o+2] = 255;
            color_data[o+3] = 255;
            o += 4;
            return;
        }
        var color = d3.rgb(colorScale(r));
        color_data[o] = color.r;
        color_data[o+1] = color.g;
        color_data[o+2] = color.b;
        color_data[o+3] = 255;
        o += 4;
    });
    ctx.putImageData(imageData, 0, 0);

    $("#map_title").text("Continuous map")
}

function render_categorical() {
    colorScale = d3.scale.ordinal().domain(Land_cover_scale[0]).range(Land_cover_scale[1]);
    var imageData = ctx.createImageData(image.getWidth(), image.getHeight());
    var color_data = imageData.data;

    var o = 0;
    baseRaster.forEach(function(r){
        if (r === ext[0]) {
            color_data[o] = 255;
            color_data[o+1] = 255;
            color_data[o+2] = 255;
            color_data[o+3] = 255;
            o += 4;
            return;
        }
        var color = d3.rgb(colorScale(r));
        color_data[o] = color.r;
        color_data[o+1] = color.g;
        color_data[o+2] = color.b;
        color_data[o+3] = 255;
        o += 4;
    });
    ctx.putImageData(imageData, 0, 0);

     $("#map_title").text("Categorical map
      ")
}

function render_legend_categorical(){
    var legend = d3.select("#legend")
        .selectAll("g.legend")
        .data(Land_cover_scale[0])
        .enter().append("g")
        .attr("class", "legend");

  legend.append("rect")
  .attr("x", 20)
  .attr("y", function(d, i){ return legend_height - (i*ls_h) - 2*ls_h;})
  .attr("width", ls_w)
  .attr("height", ls_h)
  .style("fill", function(d, i) { return Land_cover_scale[1][i]; })
  .style("opacity", 0.8);

  legend.append("text")
  .attr("x", 50)
  .attr("y", function(d, i){ return legend_height - (i*ls_h) - ls_h - 4;})
  .text(function(d, i){ return Land_cover_scale[2][i]; });
}

// TODO !!
function render_legend_continuous(){
    var legend = d3.select("#legend")
        .selectAll("g.legend")
        .data(newExt) // domain of continuous map ???
        .enter().append("g")
        .attr("class", "legend");

  legend.append("rect")
  .attr("x", 20)
  .attr("y", function(d, i){ return legend_height - (i*ls_h) - 2*ls_h;})
  .attr("width", ls_w)
  .attr("height", ls_h)
  .style("fill", function(d, i) { return Land_cover_scale[1][i]; })
  .style("opacity", 0.8);

  legend.append("text")
  .attr("x", 50)
  .attr("y", function(d, i){ return legend_height - (i*ls_h) - ls_h - 4;})
  .text(function(d, i){ return Land_cover_scale[2][i]; });
}

}
