var colorScale;
var calc_tot_obj_score;
var tot_awy_score, tot_sde_score, tot_sdl_score, num_runs_selected;
var landcovermap = "./data/initial_maps/maragua_base_lulc.tif";
var map_chosen = landcovermap; //map to display initially
var map_controls_selection;
var continuous_scale_categories = [];
var imageBitmap;

var MAP = {};

function map(){

    var baseRaster, ext, newExt, image, rasters, canvas, ctx;

    // continuous scale
    var startColor = d3.rgb("#a50026");
    var endColor = d3.rgb("#006837");

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
        render_map('map_canvas', map_chosen);
    });

    // Update map upon radiobutton choices
    $("input[name='radiobutton']").change(function(){
        choose_map("allDataset");
        render_map('map_canvas', map_chosen);
    });

    //Overlay on landcover
    render_map('map_canvas2', landcovermap);
    $("#map_canvas2").addClass('invisiblee');

    $('#landcover_checkbox').change(function() {
        if(this.checked) {
            $("#map_canvas2").removeClass('invisiblee');
        }
        else{
            $("#map_canvas2").addClass('invisiblee');
        }
    });


    render_map('map_canvas', map_chosen);
    update_map_stats(full_data);



    function render_map(canvas_ID, which_map) {

        addLoadingIndicator('#map_n_legend');

        d3.xhr(which_map)
            .responseType('arraybuffer')
            .get(function(error, data){
                var parser = GeoTIFF.parse(data.response);
                image = parser.getImage();
                rasters = image.readRasters();
                canvas = document.getElementById(canvas_ID);
                ctx = document.getElementById(canvas_ID).getContext("2d");
                // there is some arbitrary value fow 'no data', that messes all my calculations
                baseRaster = rasters[0];
                ext = d3.extent(baseRaster);
                newExt = d3.extent(baseRaster.filter(function(r){ return r != ext[0]; }));


                if ($('#map_toggle').prop('checked')) {
                    render_continuous(ctx);
                    render_legend_continuous(ctx);
                } else {
                    render_categorical(ctx,canvas_ID);
                    render_legend_categorical(ctx);
                }

                removeLoadingIndicator('#map_n_legend');

            });
    }

    function render_continuous(ctx) {
        colorScale = d3.scale.linear().domain(newExt).range([startColor.toString(), endColor.toString()]);
        var imageData = ctx.createImageData(image.getWidth(), image.getHeight());
        var color_data = imageData.data;

        var o = 0;
        baseRaster.forEach(function(r){
            // ext[0] is the NO-DATA value (ext is [min,max]) so we make it transparent
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


        createImageBitmap(imageData).then(function(response) {
            imageBitmap = response;
            ctx.drawImage(response, 0, 0);
        });

        // Continuous scale
        continuous_scale_categories = [];
        for (var i = newExt[0]; i <= newExt[1]; i+=((newExt[1]-newExt[0])/19)){
            continuous_scale_categories.push(i);
        };
    }

    function render_categorical(ctx,canvas_ID, raster) {
        if (!raster) {
            raster = baseRaster;
        }

        colorScale = d3.scale.ordinal().domain(Land_cover_scale[0]).range(Land_cover_scale[1]);
        var imageData = ctx.createImageData(image.getWidth(), image.getHeight());
        var color_data = imageData.data;

        var o = 0;
        raster.forEach(function(r){
            // ext[0] is the NO-DATA value (ext is [min,max]) so we make it transparent
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
        createImageBitmap(imageData).then(function(response) {
            if (canvas_ID==='map_canvas2'){
                imageBitmap2 = response;
            }else{
                imageBitmap = response;
            }
            ctx.drawImage(response, 0, 0);
        });

    }

    function render_legend_categorical(ctx){
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

    function render_legend_continuous(ctx){
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

    // ------------ Zooming functionalities --------------

    function zoom() {
        var context = d3.select('#map_canvas').node().getContext("2d");
        var context2 = d3.select('#map_canvas2').node().getContext("2d");
        drawMapZoomed(context,imageBitmap);
        drawMapZoomed(context2,imageBitmap2);
    }

    function drawMapZoomed(context, img){
        context.save();
        context.clearRect(0, 0, 1030, 335);
        context.translate(d3.event.translate[0], d3.event.translate[1]);
        context.scale(d3.event.scale, d3.event.scale);
        context.drawImage(img, 0, 0);
        context.restore();
    }


    d3.select("#btnZoom").on('click',function()
    {
        if ($("#btnZoom").text() === "Enable zooming"){
            var canvas = d3.select('#map_canvas').call(d3.behavior.zoom().scaleExtent([0.4, 8]).on("zoom", zoom));
            var canvas2 = d3.select('#map_canvas2').call(d3.behavior.zoom().scaleExtent([0.4, 8]).on("zoom", zoom));

            $("#btnZoom").html("Reset zoom");
        } else {
            render_map('map_canvas', map_chosen);
            render_map('map_canvas2', landcovermap);
            $("#btnZoom").html("Reset zoom");
        }
    });
    // ------------ End of zooming functionalities --------------

    MAP.render_categorical = render_categorical;
    MAP.render_continuous = render_continuous;

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


    console.log('choose_map', subset, d);

    var map_titles_many_solns = ["Modal portfolio",
        "Percent agreement map",
        "Footprint of portfolios",
        "Objective score map for Annual Water Yield",
        "Objective score map for Sediment Export",
        "Objective score map for Sediment Loss"];

    var map_titles_single_sol = ["Portfolio of run #",
        "(doesn't make sense)",
        "(doesn't make sense)",
        "Objective score map for Annual Water Yield, run #",
        "Objective score map for Sediment Export, run #",
        "Objective score map for Sediment Loss, run #"];

    var map_stats_txt = ["over " + num_runs_selected + " runs",
        "over " + num_runs_selected + " runs",
        "over " + num_runs_selected + " runs",
        "Total AWY score = " + (tot_awy_score*1000).toFixed(2) + "*10^3 m3/yr",
        "Total SDE score = " + (tot_sde_score*1000).toFixed(2) + "*10^3 tons to streams/yr",
        "Total SDL score = " + (tot_sdl_score*1000).toFixed(2) + "*10^3 tons eroded/yr"];

    // For marginal values
    /*var map_stats_txt = ["over " + num_runs_selected + " runs",
     "over " + num_runs_selected + " runs",
     "over " + num_runs_selected + " runs",
     "Total increase AWY score = " + (tot_awy_score*1000).toFixed(2) + "*10^3 m3/yr",
     "Total SDE score = " + (tot_sde_score*1000).toFixed(2) + " 10^3 tons to streams avoided/yr",
     "Total SDL score = " + (tot_sdl_score*1000).toFixed(2) + " 10^3 tons avoided erosion /yr"];

     */

    var initial_maps = ["./data/initial_maps/maragua_modalportfolio.tif",
        "./data/initial_maps/maragua_frequency.tif",
        "./data/initial_maps/maragua_footprint.tif",
        "./data/initial_maps/maragua_obj_awy.tif",
        "./data/initial_maps/maragua_obj_sde.tif",
        "./data/initial_maps/maragua_obj_sdl.tif"];

    var single_maps = ["port_rast",
        "./data/initial_maps/maragua_modalportfolio.tif",
        "./data/initial_maps/maragua_modalportfolio.tif",
        'AWY_1_rast_delta_abs',
        'SDE_2_rast_delta_abs',
        'SDL_3_rast_delta_abs',];

    //Map selection : s
    var s = 3*($('#map_toggle').prop('checked')) + parseFloat($('input[name=radiobutton]:checked').val()) - 1;
    //0: Porfolio, 1: %, 2: footprint
    //3: AWY, 4: SDE, 5: SDL






    if (subset=="allDataset") {
        map_chosen = initial_maps[s];
        $("#map_stat").text(map_stats_txt[s]);
        $("#map_title").text(map_titles_many_solns[s]);
    }
    else if (subset=="filtered"){
        console.log("Je vais display la filtered map dans ce cas là! RASTER ON THE FLY COMPUTATION IS A NEXT STEP");
    }

    else if (subset=="singleSol"){
        if (d[single_maps[s]] == undefined){
            console.log("undefined map chosen !!!"); //make an alert that you cannot choose footrpint nor percent agreement w/ single sol?
        }else{
            map_chosen = "./data/".concat(d[single_maps[s]]);
        }
        $("#map_title").text(map_titles_single_sol[s] + d.index);
        $("#map_stat").text("Do we want to display smg here ?");
        console.log("map chosen:" + map_chosen);
    }
    else {
        //map chosen remain unchanged
    }


    // Objective score maps
    if ($('#map_toggle').prop('checked')) {
        $("#label_radio1").text("Annual Water Yield (AWY)");
        $("#label_radio2").text("Sediment Export (SDE)");
        $("#label_radio3").text("Sediment Loss (SDL)");
        $("#ObjToggle").removeClass("invisiblee");
        $("#landcover_checkbox").addClass("invisiblee");
        $("#overlay_txt").addClass("invisiblee");
        $("#map_canvas2").addClass('invisiblee');

    }
    // Land cover (categorical) maps
    else {
        console.log('cover');
        $("#label_radio1").text("Modal portfolio");
        $("#label_radio2").text("Percent agreement map");
        $("#label_radio3").text("Footprint of portfolios");
        $("#landcover_checkbox").removeClass("invisiblee");
        $("#ObjToggle").addClass("invisiblee");
        $("#overlay_txt").removeClass("invisiblee");
        // check if we need to bring back land cover
        if ($('#landcover_checkbox').prop('checked')) {
            $("#map_canvas2").removeClass('invisiblee');
        } else{
            $("#map_canvas2").addClass('invisiblee');
        }
    }

}
