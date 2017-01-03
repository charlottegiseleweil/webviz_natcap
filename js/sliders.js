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
   brushed_data = dimensions["awy_weight"].filter(interval).top(Infinity);


   //Some checkpoints
   //console.log(interval_percent);
   //console.log(interval);
   //console.log(dimensions["awy_weight"].top(Infinity).length);

   //LINK TO ZE PLOTS
   renderAll_brushed();

  //Link to parcoords (machiavéliquement)
  //brushes['awy_weight'] = interval
  //D.pc.brushExtents(brushes)
});

obj2_slider.on("slide", function(interval_percent) {
   // Pour afficher le range séléctioné (need to do a #obj1_slider_txt object in html):
   // d3.select("#obj1_slider_txt").text("min: " + e[0] + ", max: " + e[1]);

   /* CROSSFILTERING */
   interval = interval_percent.map((z)=>z/100)
   brushed_data = dimensions["sde_weight"].filter(interval).top(Infinity);

   //LINK TO ZE PLOTS
   renderAll_brushed();

  //Link to parcoords (machiavéliquement)
  //brushes['sde_weight'] = interval
  //D.pc.brushExtents(brushes)
});

obj3_slider.on("slide", function(interval_percent) {
   // Pour afficher le range séléctioné (need to do a #obj1_slider_txt object in html):
   // d3.select("#obj1_slider_txt").text("min: " + e[0] + ", max: " + e[1]);

   /* CROSSFILTERING */
   interval = interval_percent.map((z)=>z/100)
   brushed_data = dimensions["sdl_weight"].filter(interval).top(Infinity);

   //LINK TO ZE PLOTS
   renderAll_brushed();

  //Link to parcoords (machiavéliquement)
  //brushes['sdl_weight'] = interval
  //D.pc.brushExtents(brushes)
});

};

           