


function crossfiltering(){

    /* Crossfilter constructor*/
    cf = crossfilter(full_data);

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
   //var group_awy_weight = dimensions["awy_weight"].group();

  //console.log(group_awy_weight)

  // Would be simpler to call the whole fct : parcoords_plot(brushed_data);

}


/* TODO 
.filter(les brushs de parcoords)   dimensions.awy_score.filter([21, 29]).top(Infinity);

.fitler (les sliders) ok
upon each event : 

 parcoords.data(brushed_data)
 parcoors.render
*/

// render_plots();
/* Map - reduce 

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
*/





/* Stratégie machiavélique de François pr updater les brush de parcoords: 
var ao = D.brushExtents()
ao['awy_score'] = [22,30]
D.pc.brushExtents(ao) */
