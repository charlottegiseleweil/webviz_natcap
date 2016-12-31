var dimensions = {};

function crossfiltering(){

    /* Crossfilter constructor*/
    var cf = crossfilter(full_data);

    /*Dimensions*/
    Object.keys(full_data[0]).forEach(function(column_name) {
        dimensions[column_name] = cf.dimension(function(d){
            return d[column_name];
        });
    });



    //Sanity check
    //console.log(dimensions["awy_weight"].top(Infinity).length);

    /*Filters*/
    // in sliders_plot

    /*Grouping*/ //TODO: automatiser le grouping
   var group_awy_weight = dimensions["awy_weight"].group();
  //console.log(group_awy_weight)

var reduce_init = function() {
  return {"count": 0, "total": 0};
}
var reduce_add = function(p, v, nf) {
  ++p.count;
  p.total += v.g_all;
  return p;
}
var reduce_remove = function(p, v, nf) {
  --p.count;
  p.total -= v.g_all;
  return p;
}

group_awy_weight.reduce(reduce_add, reduce_remove, reduce_init);

group_awy_weight
    .top(Infinity)
    .forEach(function(d,i){ 
        console.log(JSON.stringify(d)); 
    })




}


/* Stratégie machiavélique de François pr updater les brush de parcoords: 

var ao = D.brushExtents()
ao['awy_score'] = [22,30]
D.pc.brushExtents(ao)



*/
/*
    
//         /*Grouping */
//         var group_1 = dim_quant1.group();
//         var group_2 = dim_quant2.group();
//         var group_3 = dim_quant3.group();
//         var group_4 = dim_quant4.group();
//         var group_5 = dim_quant5.group();
//         var group_6 = dim_quant6.group();
//         var group_7 = dim_quant7.group();
//         var group_8 = dim_quant8.group();
//         var group_9 = dim_quant9.group();
//         var group_10 = dim_quant10.group();



//         /* 
//             // sanity check
    
//             group_team
//               .top(Infinity)
//               .forEach(function(d, i) {
//                 console.log(JSON.stringify(d));
//               });
              
//             */

//         /* --------------------------------------------------------- 
    
//               Add a third and 4th variable to this map reduction
//               - the third should be the minimum year
//               - the fourth should be the maximum year
//               - hint: use inequalities
              
//             */

//         var reduce_init = function() {
//             return {
//                 "count": 0,
//                 "total": 0
//             };
//         }

//         var reduce_add = function(p, v, nf) {
//             ++p.count;
//             p.total += v.g_all;
//             return p;
//         }

//         var reduce_remove = function(p, v, nf) {
//             --p.count;
//             p.total -= v.g_all;
//             return p;
//         }

//         /* --------------------------------------------------------- NOT SURE I UNDERSTAND more complex reductions*/

//         group_1.reduce(reduce_add, reduce_remove, reduce_init);
//         group_2.reduce(reduce_add, reduce_remove, reduce_init);
//         group_3.reduce(reduce_add, reduce_remove, reduce_init);
//         group_4.reduce(reduce_add, reduce_remove, reduce_init);
//         group_5.reduce(reduce_add, reduce_remove, reduce_init);
//         group_6.reduce(reduce_add, reduce_remove, reduce_init);
//         group_7.reduce(reduce_add, reduce_remove, reduce_init);
//         group_8.reduce(reduce_add, reduce_remove, reduce_init);
//         group_9.reduce(reduce_add, reduce_remove, reduce_init);
//         group_10.reduce(reduce_add, reduce_remove, reduce_init);
      
//         var test = group_9.sum()
// console.log(group_9.sum())


//         var render_plots = function() {
//             // count refers to a specific key specified in reduce_init 
//             // and updated in reduce_add and reduce_subtract
//             // Modify this for the chart to plot the specified variable on the y-axis
//             hist(group_1.sum(),
//                 "appearances_by_quantiles",
//                 "count",
//                 "Number of datapoints per cost range"
//             );

//             /* build more charts here */

//         }


        


        // Event handlers for the sliders (?????) +  // filter based on the UI element ////////not sure I understand 

//         input1_slider.on("slide", function(e) {
//             d3.select("#input1_slider_txt").text("min: " + e[0] + ", max: " + e[1]);
//             dim_input1.filter(e);
//             // re-render
//             render_plots();
           
//         });
//         input2_slider.on("slide", function(e2) {
//             d3.select("#input2_slider_txt").text("min: " + e2[0] + ", max: " + e2[1]);
//             dim_input2.filter(e2);
//             // re-render
//             render_plots();
            
//         });
//         input3_slider.on("slide", function(e3) {
//             d3.select("#input3_slider_txt").text("min: " + e3[0] + ", max: " + e3[1]);
//             dim_input3.filter(e3);
//             // re-render
//             render_plots();
            
//         });
//         input4_slider.on("slide", function(e4) {
//             d3.select("#input4_slider_txt").text("min: " + e4[0] + ", max: " + e4[1]);
//             dim_input4.filter(e4);
//             // re-render
//             render_plots();
            
//         });
//         input5_slider.on("slide", function(e5) {
//             d3.select("#input5_slider_txt").text("min: " + e5[0] + ", max: " + e5[1]);
//             dim_input5.filter(e5);
//             // re-render
//             render_plots();
            
//         });
//         input6_slider.on("slide", function(e6) {
//             d3.select("#input6_slider_txt").text("min: " + e6[0] + ", max: " + e6[1]);
//             dim_input6.filter(e6);
//             // re-render
//             render_plots();
            
//         });
//         input7_slider.on("slide", function(e7) {
//             d3.select("#input7_slider_txt").text("min: " + e7[0] + ", max: " + e7[1]);
//             dim_input7.filter(e7);
//             // re-render
//             render_plots();
            
//         });
//         input8_slider.on("slide", function(e8) {
//             d3.select("#input8_slider_txt").text("min: " + e8[0] + ", max: " + e8[1]);
//             dim_input8.filter(e8);
//             // re-render
//             render_plots();
            
//         });
//         input9_slider.on("slide", function(e9) {
//             d3.select("#input9_slider_txt").text("min: " + e9[0] + ", max: " + e9[1]);
//             dim_input9.filter(e9);
//             // re-render
//             render_plots();
            
//         });






//         /* add at least 3 more event handlers here */


//         /* --------------------------------------------------------- */



//         render_plots(); // this just renders the plots for the first time ????????????????????? why a second time ????

//     });
// */