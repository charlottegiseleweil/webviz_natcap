var full_data;
  
  //load csv data file & creates plots
  function main(){
    d3.csv('data/fake1.csv', function(data) { 
      full_data = data;
      parcoords_plot();
      sliders_plot();
      crossfiltering();
    });
  }