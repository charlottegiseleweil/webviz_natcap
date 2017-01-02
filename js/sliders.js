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

  var brushes = D.brushExtents();


obj1_slider.on("slide", function(interval_percent) {
   // Pour afficher le range séléctioné (need to do a #obj1_slider_txt object in html):
   // d3.select("#obj1_slider_txt").text("min: " + e[0] + ", max: " + e[1]);

   /* CROSSFILTERING */
   // c'est un peu le break-techte.. soit un pars sur un principe ou un brush tout ou un brush rien
    // MAIS en meme temps on je trouve bien d'avoir les datas 'brushables' a la parcoord quand on brush sur
    // parcoord

    interval = interval_percent.map( (z) => z / 100);
    var theData = dimensions["awy_weight"].filter(interval).top(Infinity);
    var be = parcoords.brushExtents();
    parcoords
        .data(theData)
        .render();
    parcoords.brushExtents(be);

});

obj2_slider.on("slide", function(interval_percent) {
   // Pour afficher le range séléctioné (need to do a #obj1_slider_txt object in html):
   // d3.select("#obj1_slider_txt").text("min: " + e[0] + ", max: " + e[1]);

    interval = interval_percent.map((z)=>z/100)
    var theData = dimensions["sdl_weight"].filter(interval).top(Infinity);
    var be = parcoords.brushExtents();
    parcoords
        .data(theData)
        .render();
    parcoords.brushExtents(be);
});

obj3_slider.on("slide", function(interval_percent) {
   // Pour afficher le range séléctioné (need to do a #obj1_slider_txt object in html):
   // d3.select("#obj1_slider_txt").text("min: " + e[0] + ", max: " + e[1]);

   /* CROSSFILTERING */
   interval = interval_percent.map((z)=>z/100)
    var be = parcoords.brushExtents();
   var theData = dimensions["sdl_weight"].filter(interval).top(Infinity);

   parcoords
       .data(theData)
       .render();
    parcoords.brushExtents(be);
});

};

           