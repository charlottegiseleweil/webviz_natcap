//Help buttons
function BtnHelp(){


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
        html: 'Explanations' + "<br/>"+ "<ul> <li> premier </li> <li> enculé de data</li> </ul>" + "<a href='gmail.com'>pute</a>" + "<p> Yo </p>" + "<h3> Connard </h3>"
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



}