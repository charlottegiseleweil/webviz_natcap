//Raster computation
function rasterComputation(maps_selected){

	addLoadingIndicator('#map_n_legend');


	var loadingQueue = queue();

	maps_selected.forEach(function(d){
		var req = d3.xhr(d).responseType('arraybuffer');
		loadingQueue.defer(req.get)
	});


	loadingQueue.awaitAll(function (error,data){
		
		var rastersArray = [];
		data.forEach(function(data,index){
				var parser = GeoTIFF.parse(data.response);
                image = parser.getImage();
                rasters = image.readRasters();
                rastersArray.push(rasters[0]);
		})
		  ext = d3.extent(rasters[0]);
	
		//	Iterate on all pixels, create a dictionary per pixel which counts the # of appearance of each value.
		var modal_portfolio_soln_raster = [];
		var frequency_map_soln_raster = [];
		var total_pixel = rastersArray[0].length;
		for (var pixelIndex = 0; pixelIndex < total_pixel; pixelIndex++) {
			//Dictionary {key:value with raster_value:count}
			var CountAppearances = {};
			
			rastersArray.forEach(function(raster){
				if (!CountAppearances[''+raster[pixelIndex]]){
					CountAppearances[''+raster[pixelIndex]] = 1;
				}
				else
				{
				CountAppearances[''+raster[pixelIndex]]++; 
				}
			});
			
			//Find the raster_value appearing the most (max count)
		    var max = 0, max_key;
			Object.keys(CountAppearances).forEach(function(key){
				if (CountAppearances[key] > max){
					max = CountAppearances[key];
					max_key = key;
				}
			})
			modal_portfolio_soln_raster[pixelIndex] = parseFloat(max_key);
			//frequency_map_soln_raster[pixelIndex] = max //todo !
			
		};
			console.log(modal_portfolio_soln_raster[7]);	
			ctx = document.getElementById('map_canvas').getContext("2d");
			MAP.render_categorical(ctx,'map_canvas',modal_portfolio_soln_raster);

			removeLoadingIndicator('#map_n_legend');
	});

}