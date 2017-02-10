var colorScale;
var calc_tot_obj_score;
var tot_awy_score, tot_sde_score, tot_sdl_score, num_runs_selected;
var map_chosen = "./data/initial_maps/maragua_base_lulc.tif"; //map to display initially
var map_controls_selection;
var continuous_scale_categories = [];

function map(){

    var baseRaster, ext, newExt, image, rasters, canvas, ctx;

    // continuous scale
    var startColor = d3.rgb("000033");
    var endColor = d3.rgb("#FF22AA");

    // categorical scale
    var Land_cover_scale_trial =[[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    ["#003366", '#f77469','#865f36','#a6c8e3',"#00336f",'#f6c8e3','#a6cee3','#1f78b4','#f77469','#b2df8a','#33a02c','#b2df86','#33002c','#f77469','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928','#b15928','#b15928','#b15928'],
    ['Urban and paved roads', 'Bare soil and unpaved roads', 'Grass', 'Shrub', 'General agriculture', 'Tea', 'Coffee', 'Mixed forest', 'Water', 'Evergreen forest', 'Forest plantation', 'Pineapple', 'Wetland', 'Orchard', 'Corn', 'Native montane bunchgrass', 'Bare rock', 'Unpaved road', 'Agroforestry', 'Riparian mgmt', 'Terracing', 'Reforestation', 'Grass strips', 'Road mitigation']];

    var Land_cover_scale =[[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    ['#99a391','#866a4e','#a4c056','#e7cf13','#f77469','#f6c8e3',"#cfb19d",'#a3eba7','#003366','#7aaf54','#467437','#e9f173','#a6c8e3','#b3c01f','#912f5c','#715edc','#a4c056','#474747','#865f36','#6696ad','#7731ad','#4de060','#ef8741','#ea81c9'],
    ['Urban and paved roads', 'Bare soil and unpaved roads', 'Grass', 'Shrub', 'General agriculture', 'Tea', 'Coffee', 'Mixed forest', 'Water', 'Evergreen forest', 'Forest plantation', 'Pineapple', 'Wetland', 'Orchard', 'Corn', 'Native montane bunchgrass', 'Bare rock', 'Unpaved road', 'Agroforestry', 'Riparian mgmt', 'Terracing', 'Reforestation', 'Grass strips', 'Road mitigation']];

    var Land_cover_scale_test =[[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
        ["#003366",'#a6c8e3',"#00336f",'#f6c8e3','#a6cee3','#1f78b4','#b2df8a','#33a02c','#b2df86','#33002c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'],
        ["Grass","Forest","Road","Land","Dry forest","introduced grassland","Sand","Barren","Woods","Grass green","Forest","Big forest","Awesome forest","Water","Unicorn","Agroforestry","Sand","Moutain","Superurban","Urban"]];

    var num_legend_boxes = Land_cover_scale[0].length + 1;
    var legend_height = 337; //(max height) chosen same height as map

    // legend box size
    var ls_w = legend_height/num_legend_boxes, ls_h = legend_height/num_legend_boxes;



    // Update map upon toggling 
    $('#map_toggle').change(function(){

      //Select the first radiobutton if none selected
        if (!(parseFloat($('input[name=radiobutton]:checked').val())>0)){
          $('input[name=radiobutton][value="1"]').attr('checked', true);
        }

      choose_map("allDataset");
      render_map();
    });

    // Update map upon radiobutton choice
    $("input[name='radiobutton']").change(function(){
        choose_map("allDataset");
        render_map();
    });

    render_map();
    update_map_stats(full_data);

    function render_map() {
        d3.xhr(map_chosen)
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

          
            if ($('#map_toggle').prop('checked')) {

                  render_continuous();
                  render_legend_continuous();        
                  } else {
                  render_categorical();
                  render_legend_categorical();
              }

        });    
    }

    function render_continuous() {
        colorScale = d3.scale.linear().domain(newExt).range([startColor.toString(), endColor.toString()]);
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
        // Continuous scale
            continuous_scale_categories = [];
            for (var i = newExt[0]; i <= newExt[1]; i+=((newExt[1]-newExt[0])/19)){
               continuous_scale_categories.push(i);
             };
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
    }

    function render_legend_categorical(){
      //remove previous legend
      d3.select("#legend")
            .selectAll("g.legend")
            .remove();

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
      .attr("x", 40)
      .attr("y", function(d, i){ return legend_height - (i*ls_h) - ls_h - 4;})
      .text(function(d, i){ return Land_cover_scale[2][i]; });
    }

    function render_legend_continuous(){
      //remove previous legend
      d3.select("#legend")
            .selectAll("g.legend")
            .remove();

      var legend = d3.select("#legend")
            .selectAll("g.legend")
            .data(continuous_scale_categories) //extends of the rasters
            .enter().append("g")
            .attr("class", "legend");

            // colorscale = d3.scale.linear(baseRaster).domain(newExt).range(["blue","red"]);

                //var Continuous_scale = TODO row 1: 10 categories from newExt
                //                            row 2: colorScale
                //                            row 3: labels
     

      legend.append("rect")
      .attr("x", 20)
      .attr("y", function(d, i){ return legend_height - (i*ls_h) - 2*ls_h;})
      .attr("width", ls_w)
      .attr("height", ls_h)
      .style("fill", function(d, i) { return colorScale(d); })
      .style("opacity", 0.8);

      legend.append("text")
      .attr("x", 50)
      .attr("y", function(d, i){ return legend_height - (i*ls_h) - ls_h - 4;})
      .text(function(d, i){ return continuous_scale_categories[i].toFixed(2); });
    }



};

//----------------------------------------------------------------------------------------



function update_map_stats(data_fed){
num_runs_selected = data_fed.length;

tot_awy_score = calc_tot_obj_score(data_fed, 'awy_score');
tot_sde_score = calc_tot_obj_score(data_fed, 'sde_score');
tot_sdl_score = calc_tot_obj_score(data_fed, 'sdl_score');
choose_map();
};

function calc_tot_obj_score(data_fed,column){
      var total = 0;
      for(var i = 0; i < data_fed.length; i++) {
        total += data_fed[i][column];
      }
      var avg = total / data_fed.length;
  return avg;
};

function choose_map(subset,d) {
  //subset can take 3 values: allDataset, filtered, singleSol.
  //allDataset = when no brush: considering full dataset (maps displayed are the overall maps)
  //filtered = displays map correponding to the specific brushed sleection: need to make calculations !
  // singleSol : displays the map corresponding to solution clicked in table (pull up map from dataset table.)
  //DRAFT !! To do !

  var map_titles = ["Modal portfolio",
                    "Percent agreement map",
                    "Footprint of portfolios",
                    "Objective score map for Annual Water Yield",
                    "Objective score map for Sediment Export",
                    "Objective score map for Sediment Loss"];

  var map_stats_txt = ["over " + num_runs_selected + " runs",
                      "over " + num_runs_selected + " runs",
                      "over " + num_runs_selected + " runs",
                      "Total AWY score = " + (tot_awy_score*100) + "*10^3 m3/yr",
                      "Total SDE score = " + (tot_sde_score*100) + " 10^3 tons eroded/yr", 
                      "Total SDL score = " + (tot_sdl_score*100) + " 10^3 tons eroded/yr"];

  var initial_maps = ["./data/initial_maps/maragua_modalportfolio.tif",
                      "./data/initial_maps/maragua_frequency.tif",
                      "./data/initial_maps/maragua_footprint.tif",
                      "./data/initial_maps/maragua_obj_awy.tif",
                      "./data/initial_maps/maragua_obj_sde.tif",
                      "./data/initial_maps/maragua_obj_sdl.tif"];

  var single_maps = ['AWY_1_rast_delta_abs'];

  //Map selection : s
  var s = 3*($('#map_toggle').prop('checked')) + parseFloat($('input[name=radiobutton]:checked').val()) - 1;
  //0: Porfolio, 1: %, 2: footprint
  //3: AWY, 4: SDE, 5: SDL

  $("#map_title").text(map_titles[s]);
  $("#map_stat").text(map_stats_txt[s]);

  if (subset=="allDataset") {
      map_chosen = initial_maps[s];
    }
    else if (subset=="filtered"){
      console.log("Je vais display la filtered map dans ce cas là! RASTER ON THE FLY COMPUTATION IS A NEXT STEP");
    }
    else if (subset=="singleSol"){
      map_chosen = "./data/".concat(d[single_maps[s]]);
    }
    else {
      //map chosen remain unchanged
    }


  // Objective score maps
  if ($('#map_toggle').prop('checked')) {
    $("#label_radio1").text("Annual Water Yield (AWY)");
    $("#label_radio2").text("Sediment Export (SDE)");
    $("#label_radio3").text("Sediment Loss (SDL)");
        }
  // Land cover (categorical) maps
  else { 
    $("#label_radio1").text("Modal portfolio");
    $("#label_radio2").text("Percent agreement map");
    $("#label_radio3").text("Footprint of portfolios");
       }

};
