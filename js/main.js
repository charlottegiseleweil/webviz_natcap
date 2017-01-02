var full_data;
  
  //load csv data file & creates plots
  function main(){
    d3.csv('data/fake1.csv', function(row) {
      var object = {};
      var keys = Object.keys(row);
      keys.forEach(function(key){
        object[key] = parseFloat(row[key]);
      });
      return object;
    }, function(data) {
      full_data = data;
      parcoords_plot();
      sliders_plot();
      crossfiltering();



  d3.select('#btnHelp_parcoords').on('click', function() 
	{alert("Parallel Coordinates Plot : Each axis corresponds to an objective, each line represents a solution. The axis can be flipped upon double clicking on their name. The axis can be re-ordered by dragging them. ");
  })
  

  d3.select('#btnHelp_sliders').on('click', function() 
  	{alert("Sliders: These sliders allow to modify the weight of each objective");
  })


 
    });
  }


   

