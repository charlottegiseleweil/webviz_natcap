var DATA = 'data/MaraguaFeb15.csv'

var full_data;
var dimensions = {};
var cf;
var brushed_data = full_data;
var parcoords;
var columns;
var columnNames;

var col_weights = [];
var col_score= [];
var col_inputs= [];
var col_maps= [];
var col_floats= [];


  function main(){

    //load csv data file & creates plots
    d3.csv(DATA, function(row) { 
      columnNames = Object.keys(row);

      //Sort out the columns
      for (var i in columnNames){
        if (/weight/.exec(columnNames[i])) {
          col_weights.push(columnNames[i])
        };
        if (/score/.exec(columnNames[i])) {
          col_score.push(columnNames[i])
        };
        if (/input/.exec(columnNames[i])) {
          col_inputs.push(columnNames[i])
        };
        if (/rast/.exec(columnNames[i])) {
          col_maps.push(columnNames[i])
        };
      }
      col_floats = columnNames.filter(x => col_maps.indexOf(x) < 0 );

      // This function to parse String data in Floats (only for non-maps columns)
      var final = {};
      col_floats.forEach(function(columnName){
        final[columnName] = parseFloat(row[columnName]);
      });
      col_maps.forEach(function(columnName){
        final[columnName] = row[columnName];
      });

      return final;


    }, function(data) {

      // Now make the plots
      full_data = data;
      crossfiltering();
      parcoords_plot();
      sliders_plot();
      map();
      scatterplots(full_data);
      scatterplotLegend();
    });


   

    //Buttons

    //Help buttons
    d3.select('#btnHelp_parcoords').on('click', function() 
      {alert("Parallel Coordinates Plot : Each axis corresponds to an objective, each line represents a solution.\
        The axis can be flipped upon double clicking on their name. The axis can be re-ordered by dragging them.\
        \
        AWY: Annual water yield [in 10^5 cubic meters water/year]\
        \
        SDE: Sediment export to stream [in 10^5 tons of sediments eroded annually]\
        \
        SDL: Soil loss to stream [in 10^5 tons of sediments eroded annually]");
    });
      
    d3.select('#btnHelp_sliders_ow').on('click', function() 
        {swal({
        title: "Objective weights sliders",
        html: 'These sliders allow to modify the weight given to each ES objective, i.e their relative importance'
         });
    });



    d3.select('#btnHelp_sliders_pu').on('click', function() 
        {swal({
        title: "Parametric Uncertainty sliders",
        html: 'These sliders allow to modify the values of the input parameters subject to uncertainty. \
                Seasonality constant : Z is an empirical constant, sometimes referred to as “seasonality factor”, which captures the local precipitation pattern and additional hydrogeological characteristics. (http://data.naturalcapitalproject.org/nightly-build/invest-users-guide/html/reservoirhydropowerproduction.html#summary) \
                K is the soil erodibility value. It measures the susceptibility of soil particles to detach and transport by rainfall and runoff.  It is used to calculate the amount of annual soil loss in the sediment retention model (http://data.naturalcapitalproject.org/nightly-build/invest-users-guide/html/sdr.html#summary) Unit in ton⋅ha⋅hr/(MJ⋅ha⋅mm)\
                Spatial input ?????\
                Budget (...)")'
         });
    });

    d3.select("#btnHelp_scatterplots").on('click',function()
      {swal({
        title: "Trade-offs curves",
        html: 'Explanations'
      });
    });

    d3.select("#btnHelp_map").on('click',function()
      {swal({
        title: "Map",
        html: 'Explanations about the different maps and features related'
      });
    });

        d3.select("#btnHelp_gnrl").on('click',function()
      {swal({
        title: "Visualization of the results of the optimization for the Maragua watershed",
        html: 'Explanations about the overall viz'
      });
    });


    //Other buttons    
    d3.select("#ViewData").on('click',function()
      {
        if ($("#ViewData").text() === "View dataset"){
          table(full_data);
          $("#table_canvas").removeClass('invisiblee');
          $("#ViewData").html("Hide Dataset");
        } else {
          $("#table_canvas").addClass('invisiblee');
          $("#ViewData").html("View dataset");
        }
      });

      d3.select('#btnReset').on('click', function() {
        parcoords.brushReset();
        
        parcoords
            .data(full_data)
            .render();

        scatterplots(full_data);

        table(full_data);
        
        obj1_slider.setValue([0, 100]);
        obj2_slider.setValue([0, 100]); 
        obj3_slider.setValue([0, 100]); 
        pu1_slider.setValue([0.5, 5]); 
        pu2_slider.setValue([1, 10]); 
        pu3_slider.setValue([0, 1]);
        pu4_slider.setValue([1, 4]);
        // todo sortir all var sliders and todo

      });

        
  };


  
  /* Useful ?

  function renderAll_brushed(){
    parcoords.data(brushed_data);
    parcoords.render();
  }

  UPON BRUSH ON parcoords (FOR EACH 3 DIM):

dimensions["awy_score"].filter(D.brushExtents().awy_score);
brushed_data = dimensions.awy_score.filter(D.brushExtents().awy_score).top(Infinity); 
renderAll_brushed();
*/