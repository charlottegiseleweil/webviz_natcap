importScripts('/js/lib/d3.queue.js');
importScripts('/js/lib/d3.js');
importScripts('/js/lib/geotiff.js');

/**
 * Main parsing function for GeoTIFF files.
 * @param {(string|ArrayBuffer)} data Raw data to parse the GeoTIFF from.
 * @param {Object} [options] further options.
 * @param {Boolean} [options.cache=false] whether or not decoded tiles shall be cached.
 * @returns {GeoTIFF} the parsed geotiff file.
 */
var parse = function parse(data, options) {
    var rawData, i, strLen, view;
    if (typeof data === "string" || data instanceof String) {
        rawData = new ArrayBuffer(data.length * 2); // 2 bytes for each char
        view = new Uint16Array(rawData);
        for (i = 0, strLen = data.length; i < strLen; ++i) {
            view[i] = data.charCodeAt(i);
        }
    } else if (data instanceof ArrayBuffer) {
        rawData = data;
    } else {
        throw new Error("Invalid input data given.");
    }
    return new GeoTIFF(rawData, options);
};



onmessage = function(e) {
    console.log('Message received from main script', e);


    //addLoadingIndicator('#map_n_legend');

    var loadingQueue = queue();

    var maps_selected = e.data;
    maps_selected.forEach(function(d){
        var req = d3.xhr('/' + d).responseType('arraybuffer');
        loadingQueue.defer(req.get)
    });


    loadingQueue.awaitAll(function (error,data){

        var rastersArray = [];
        data.forEach(function(data,index){
            var parser = parse(data.response);
            image = parser.getImage();
            rasters = image.readRasters();
            rastersArray.push(rasters[0]);
        });

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
            });
            modal_portfolio_soln_raster[pixelIndex] = parseFloat(max_key);
            //frequency_map_soln_raster[pixelIndex] = max //todo !

            if (pixelIndex % 1000 === 0) {
                postMessage({
                    type: 'progress',
                    currentPixel: pixelIndex,
                    totalPixel: total_pixel
                });
            }


        }

        //TODO(chab) using Transferable will improve performance
        postMessage({
            type: 'success',
            raster : modal_portfolio_soln_raster
        });

    });
}