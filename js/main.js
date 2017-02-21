var DATA = 'data/MaraguaFeb16.csv';

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
      filtered_data = full_data = data;
      crossfiltering();
      parcoords_plot();
      sliders_plot();
      map();
      scatterplots(full_data);
      scatterplotLegend();
      BtnHelp();


      //wire events
      $('#scatterplot_frontiers_checkbox').change(function() {
          if(this.checked) {
              $(".frontier").removeClass('invisiblee');
          }
          else{
              $(".frontier").addClass('invisiblee');
          }
      });

      /* Failed attempt to make tick checkbox
      $('#scatterplot_ticks_checkbox').change(function() {
          if(this.checked) {
              scatterplots(filtered_data,6);
          }
          else{
              scatterplots(filtered_data,0);
          }
      });
      */


    });

    //Buttons 
    //TODO: RIGHT NOW ONLY DOING IT FOR PORTFOLIOS !
    d3.select("#Calc_map").on('click',function()  {
        var filtered_maps = filtered_data.map(function(d){
        return  ('./data/' + d.port_rast)
        });
      rasterComputation(filtered_maps);
    });
    //todo : mettre ce button dans le script map/ et choisir le type de map selon la selection des map_controls.
      
    

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