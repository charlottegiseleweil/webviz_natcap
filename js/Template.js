//TEMPLATE FILE - TRYING TO LINK SCATTERPLOTS TO PARCOORDS UPON BRUSHING


    obj3_slider.on("slide", function(interval_percent) {
        slideDimension(interval_percent, 'sdl_weight');
    });

    function brushDimension(brushExtents, dimensionName) {
        interval = intervalPercent.map((z)=>z/100);
        var be = parcoords.brushExtents();
        var filtered_data = dimensions[dimensionName].filter(be).top(Infinity);

        // Update Pacoords + recalculate brushes
        parcoords
            .data(filtered_data)
            .render();
        parcoords.brushExtents(be);

        //Update scatterplots
        scatterplots(filtered_data);
    }


    parcoords.brushExtents()

        var filtered_data = dimensions[dimensionName].filter(interval).top(Infinity);

//Upon brushing paarcoords :
/* 

something like paarcoords.on("brush", function(){}


*/
___

//There has to be a more proper way to do this with a joli for loop:

//Update scatteplots for each brushed dimension
be1 = parcoords.brushExtents().awy_score
be2 = parcoords.brushExtents().sde_score
be3 = parcoords.brushExtents().sdl_score

filtered_data = dimensions['awy_score'].filter(be1).top(Infinity);
filtered_data = dimensions['sde_score'].filter(be2).top(Infinity);
filtered_data = dimensions['sdl_score'].filter(be3).top(Infinity);

scatterplots(filtered_dataaa);