var obj1_slider, obj2_slider, obj3_slider, pu1_slider, pu2_slider, pu3_slider, pu4_slider ;

function sliders_plot(){

// OBJECTIVE WEIGHTS SLIDERS
    obj1_slider = new Slider(
         "#obj1_slider", {
             "id": "obj1_slider",
             "min": 0,
             "max": 100,
             "range": true,
             "value": [0, 100],
             "step":25 //generic? change this to fit the weights values

   });

  obj2_slider = new Slider(
         "#obj2_slider", {
             "id": "obj2_slider",
             "min": 0,
             "max": 100,
             "range": true,
             "value": [0, 100],
             "step":25 //generic? change this to fit the weights values
   });
     
   obj3_slider = new Slider(
         "#obj3_slider", {
             "id": "obj3_slider",
             "min": 0,
             "max": 100,
             "range": true,
             "value": [0, 100],
             "step":25 //generic? change this to fit the weights values
   });


 // PARAMETRIC UNCERTAINTY SLIDERS

   pu1_slider = new Slider(
         "#pu1_slider", {
             "id": "obj1_slider",
             "min": 0.5,
             "max": 5,
             "range": true,
             "value": [0.5, 5],
             "step":0.5 //generic? change this to fit the weights values

   });

  pu2_slider = new Slider(
         "#pu2_slider", {
             "id": "obj2_slider",
             "min": 1,
             "max": 10,
             "range": true,
             "value": [1, 10],
             "step":1 //generic? change this to fit the weights values
   });
     
   pu3_slider = new Slider(
         "#pu3_slider", {
             "id": "obj3_slider",
             "min": 0,
             "max": 1,
             "range": false,
             "value": [0, 1],
             "step":1 //generic? change this to fit the weights values
   });

    pu4_slider = new Slider(
         "#pu4_slider", {
             "id": "obj1_slider",
             "min": 1,
             "max": 4,
             "range": true,
             "value": [1, 4],
             "step":1 //generic? change this to fit the weights values

   });


//LINK SLIDERS TO PARCOORDS AND SCATTERPLOTS
    obj1_slider.on("slide", function(interval_percent) {
       // Pour afficher le range séléctioné (need to do a #obj1_slider_txt object in html):
       // d3.select("#obj1_slider_txt").text("min: " + e[0] + ", max: " + e[1]);
        slideDimension(interval_percent, 'awy_weight');

    });
    obj2_slider.on("slide", function(interval_percent) {
        slideDimension(interval_percent, 'sde_weight');
    });
    obj3_slider.on("slide", function(interval_percent) {
        slideDimension(interval_percent, 'sdl_weight');
    });

    function slideDimension(intervalPercent, dimensionName) {
        interval = intervalPercent.map((z)=>z/100);
        var be = parcoords.brushExtents();
        var filtered_data = dimensions[dimensionName].filter(interval).top(Infinity);

        // Update Pacoords + recalculate brushes
        parcoords
            .data(filtered_data)
            .render();
        parcoords.brushExtents(be);

        //Update scatterplots
        scatterplots(filtered_data);

        //Update map
        update_map_stats(filtered_data);
    }
}

           