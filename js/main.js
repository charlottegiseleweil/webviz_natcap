var DATA = 'data/MaraguaMarch1.csv';

var full_data;
var dimensions = {};
var cf;
var brushed_data = full_data;
var parcoords;
var columns;
var columnNames;
var nbTicks = 0;

var col_weights = [];
var col_score = [];
var col_inputs = [];
var col_maps = [];
var col_floats = [];
var col_piecharts = [];
var columnsToCrossfilter = [];

  function main(){


    //load csv data file & creates plots
    d3.csv(DATA, function(row, i) { 
      columnNames = Object.keys(row);
      
      //Sort out the columns
      if (i===0){
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
          if (/frac|npix|budg$/.exec(columnNames[i])) {
            col_piecharts.push(columnNames[i])
          };
        }
        col_floats = columnNames.filter(x => col_maps.indexOf(x) < 0 );
        columnsToCrossfilter = col_score.concat('index').concat(col_weights).concat(col_inputs);
      };

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
      filtered_data = full_data = data;
      crossfiltering();
      parcoords_plot();
      sliders_plot();
      map();
      scatterplots(full_data);
      scatterplotLegend();
      BtnHelp();
      initPiePlot();
      hover_map();


      //wire events
      $('#scatterplot_frontiers_checkbox').change(function() {
          if(this.checked) {
              $(".frontier").removeClass('invisiblee');
          }
          else{
              $(".frontier").addClass('invisiblee');
          }
      });

      //Failed attempt to make tick checkbox
      $('#scatterplot_ticks_checkbox').change(function() {
          if(this.checked) {
              nbTicks=6;
          }
          else{
              nbTicks=0;
          }
          scatterplots(filtered_data,nbTicks);
      });
      

      //Mmmm wonder why this isn't working either?
      $('#scatterplot_legend_checkbox').change(function() {
          if(this.checked) {
              $("#scatterplot_legend").removeClass('invisiblee');
          }
          else{
              $("#scatterplot_legend").addClass('invisiblee');
          }
      });


    });
      
    

    //Other buttons    
    d3.select("#ViewData").on('click',function()
      {
        if ($("#ViewData").text() === "View dataset"){
          table(filtered_data);
          $("#table_canvas").removeClass('invisiblee');
          $("#ViewData").html("Hide Dataset");
        } else {
          $("#table_canvas").addClass('invisiblee');
          $("#ViewData").html("View dataset");
          $("#pie-chart").addClass('invisiblee').removeClass('inline');
        }
      });

      d3.select('#btnReset').on('click', function() {
        filtered_data = full_data;

        parcoords.brushReset();
        parcoords
            .data(full_data)
            .render();
        scatterplots(full_data);
        table(full_data);
          // render_map('map_canvas', map_chosen);
          // this will not be enough, because we listen to the slide event, and not to the change event
          // so we need to slide 'manually'
          obj1_slider.setValue([0, 100]);
          obj2_slider.setValue([0, 100]);
          obj3_slider.setValue([0, 100]);
          pu1_slider.setValue([0.5, 5]);
          pu2_slider.setValue([1, 10]);
          pu3_slider.setValue([0, 1]);
          pu4_slider.setValue([1, 4]);
          //and as paarcoords does not know about parcoords, we need to reset the dimensions used in parcoords
          var dimensionsName = Object.keys(dimensions);
          // RESET ALL FILTERS
          dimensionsName.forEach((dimension, index) => {
              dimensions[dimension].filter().top(Infinity);
          });

        update_map_stats(full_data);
        choose_map('allDataset');

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