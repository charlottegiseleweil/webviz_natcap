function sliders_plot(){

   var obj1_slider = new Slider(
         "#obj1_slider", {
             "id": "obj1_slider",
             "min": 0,
             "max": 100,
             "range": true,
             "value": [0, 100]
   });

  var obj2_slider = new Slider(
         "#obj2_slider", {
             "id": "obj2_slider",
             "min": 0,
             "max": 100,
             "range": true,
             "value": [0, 100]
   });
     
   var obj3_slider = new Slider(
         "#obj3_slider", {
             "id": "obj3_slider",
             "min": 0,
             "max": 100,
             "range": true,
             "value": [0, 100]
   });

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

        //Update scatteplots
        scatterplots(filtered_data);
    }
}

           