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

  var brushes = D.brushExtents()


obj1_slider.on("slide", function(interval_percent) {
   // Pour afficher le range séléctioné (need to do a #obj1_slider_txt object in html):
   // d3.select("#obj1_slider_txt").text("min: " + e[0] + ", max: " + e[1]);

   /* CROSSFILTERING */
   interval = interval_percent.map((z)=>z/100)
   dimensions["awy_weight"].filter(interval);

   //Some checkpoints
   //console.log(interval_percent);
   console.log(interval);
   //console.log(dimensions["awy_weight"].top(Infinity).length);

   //LINK TO ZE PLOTS
   //my_plot_function( group_player.top(Infinity) );
   /*parcoords
      .data(full_data) //data brushed here ?
      //.hideAxis(["sde_weight","sdl_weight", "awy_weight"])    //modular: names of hidden axis in the parcoord plot
      .composite("darker")
      .render()
      .shadows()
      .reorderable()
      .brushMode("1D-axes");  // enable brushing*/

    //Link to parcoords
  brushes['awy_weight'] = interval
  D.pc.brushExtents(brushes)
});

obj2_slider.on("slide", function(interval_percent) {
   // Pour afficher le range séléctioné (need to do a #obj1_slider_txt object in html):
   // d3.select("#obj1_slider_txt").text("min: " + e[0] + ", max: " + e[1]);

   /* CROSSFILTERING */
   interval = interval_percent.map((z)=>z/100)
   dimensions["sde_weight"].filter(interval);

   //Some checkpoints
   //console.log(interval_percent);
   console.log(interval);
   //console.log(dimensions["awy_weight"].top(Infinity).length);

   //LINK TO ZE PLOTS
   //my_plot_function( group_player.top(Infinity) );
   /*parcoords
      .data(full_data) //data brushed here ?
      //.hideAxis(["sde_weight","sdl_weight", "awy_weight"])    //modular: names of hidden axis in the parcoord plot
      .composite("darker")
      .render()
      .shadows()
      .reorderable()
      .brushMode("1D-axes");  // enable brushing*/

    //Link to parcoords
  brushes['sde_weight'] = interval
  D.pc.brushExtents(brushes)
});

obj3_slider.on("slide", function(interval_percent) {
   // Pour afficher le range séléctioné (need to do a #obj1_slider_txt object in html):
   // d3.select("#obj1_slider_txt").text("min: " + e[0] + ", max: " + e[1]);

   /* CROSSFILTERING */
   interval = interval_percent.map((z)=>z/100)
   dimensions["sdl_weight"].filter(interval);

   //Some checkpoints
   //console.log(interval_percent);
   console.log(interval);
   //console.log(dimensions["awy_weight"].top(Infinity).length);

   //LINK TO ZE PLOTS
   //my_plot_function( group_player.top(Infinity) );
   /*parcoords
      .data(full_data) //data brushed here ?
      //.hideAxis(["sde_weight","sdl_weight", "awy_weight"])    //modular: names of hidden axis in the parcoord plot
      .composite("darker")
      .render()
      .shadows()
      .reorderable()
      .brushMode("1D-axes");  // enable brushing*/

    //Link to parcoords
  brushes['sdl_weight'] = interval
  D.pc.brushExtents(brushes)
});

};

           