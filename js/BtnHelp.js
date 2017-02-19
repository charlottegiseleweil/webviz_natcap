//Help buttons
function BtnHelp(){


    //Help buttons
    d3.select('#btnHelp_parcoords').on('click', function() 
      {swal({
        title: "Parallel coordinate plot",
        html: "Each vertical axis corresponds to an ES objective, each line represents a scenario" +
                "The values plotted correspond to the overall aggregated objective score, for the scenario considered (i.e the sum of all pixels’ scores for this objective, across the raster)."\
                + "<br/>" + "<br/>" + 
                "<ul> <li> AWY: Annual water yield in 10<sup>6</sup> m<sup>3</sup>/year </li> \
                <li> SDE: Sediment export to stream in 10<sup>6</sup> tons of sediments eroded annually</li>\
                <li> SDL: Soil loss to stream in 10<sup>6</sup> tons lost to stream annually</li> </ul>" + 
                "<i> Features </i>" +
                "<ul> <li> Select a subset of solution : by brushing on any axis </li> \
                <li> Flip axis direction: upon double clicking on their name </li>\
                <li> Re-order axis: by dragging them</li> </ul>" 
         });
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