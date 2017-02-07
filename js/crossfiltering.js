

function crossfiltering(){

    /* Crossfilter constructor*/
    cf = crossfilter(full_data);

    /*Dimensions*/
    Object.keys(full_data[0]).forEach(function(column_name) {
        dimensions[column_name] = cf.dimension(function(d){
            return d[column_name];
        });
    });


};


