
    var imageData;
    var imgBitmap;
    // open the map, setup center and zoom level
    var map = new L.Map("map", {center: [37.8, -96.9], zoom: 4})
        .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));

    var myCustomCanvasDraw = function(){
        this.onLayerDidMount = function (){
            // -- prepare custom drawing
        };
        this.onLayerWillUnmount  = function(){
            // -- custom cleanup
        };
        this.setData = function (data){
            // -- custom data set
            this.needRedraw(); // -- call to drawLayer
        };

        // this will be called automatically
        this.onDrawLayer = function (canvasOverlay, params){

            //console.log('ca sert a kekchose je sais plus le retour 3 ?????');
            var ctx = canvasOverlay.canvas.getContext('2d');
            // je donne un mauvais example aux generations futures :)
            ctx.clearRect(0, 0, 5000, 5000);
            // -- custom  draw
            /*var d = circles[0].coordinates;
             // THIS MAKES THE MAGIC, SO WHY IT IS COMMENTED ?????
             var point = map.latLngToContainerPoint(new L.LatLng(d[0], d[1]));
             // OR
             ctx.beginPath();
             ctx.arc(point.x, point.y, 40, 0, 2 * Math.PI);
             ctx.stroke();
             ctx.globalAlpha = 0.0;
             ctx.fillStyle = '#AAF255';
             ctx.fill();*/
            // this was a circle on new york ??
            var newExt, image, colorScale;
            // we make this crap here but it SHOULD BE PULLED OUTSIDE
            if (bitmaps.length === 0 && !processing) {
                processing = true;

                var requestQueue = d3.queue();
                sheds.forEach(function(shed){
                    var shedRequest = d3.request(shed).responseType('arraybuffer');
                    requestQueue.defer(shedRequest.get);
                });

                 requestQueue
                    .awaitAll(function  (error, data) {
                        data.forEach(function(data, index) {
                            var parser = GeoTIFF.parse(data.response);
                            image = parser.getImage();
                            rasters = image.readRasters();
                            // there is some arbitrary value fow 'no data', that messes all my calculations
                            ext = d3.extent(rasters[0]);
                            newExt = d3.extent(rasters[0].filter(function (r) {
                                return r != ext[0];
                            }));
                            baseRaster = rasters[0];
                            render(baseRaster, ext, newExt, image, boundsArray[index], index);
                        });

                    });

                // Try to reduce the number of args
                function render(baseRaster, ext, newExt, image, bound, index) {

                    //TODO find a way to grab the context before, so we can separate the creation
                    //of the rasters from the map rendering
                    imageData = ctx.createImageData(image.getWidth(), image.getHeight());
                    var data = imageData.data;
                    var o = 0;
                    var color = d3.color(colorsRange[index]);
                    // WE DO NOT USE GLOBAL ALPHA THERE
                    baseRaster.forEach(function (r) {
                        if (r === ext[0]) {
                            data[o] = 255;
                            data[o + 1] = 255;
                            data[o + 2] = 255;
                            data[o + 3] = 0;
                            o += 4;
                            return;
                        }
                        data[o] = color.r;
                        data[o + 1] = color.g;
                        data[o + 2] = color.b;
                        data[o + 3] = 200;
                        o += 4;
                    });


                    var containerSw = map.latLngToContainerPoint(bound.southWest);
                    var containerNe = map.latLngToContainerPoint(bound.northEast);
                    createImageBitmap(imageData).then(function (response) {
                        imgBitmap = response;
                        bitmaps[index] = response;
                        ctx.drawImage(imgBitmap, containerSw.x, containerSw.y, containerNe.x - containerSw.x, containerNe.y - containerSw.y);
                    });
                }
            } else {

                bitmaps.forEach(function(bitmap, index) {
                    var bound = boundsArray[index];
                    var containerSw = map.latLngToContainerPoint(bound.southWest);
                    var containerNe = map.latLngToContainerPoint(bound.northEast);
                    ctx.drawImage(bitmap, containerSw.x, containerSw.y,
                        containerNe.x - containerSw.x, containerNe.y - containerSw.y);
                });
            }
        }
    };

    myCustomCanvasDraw.prototype = new L.CanvasLayer(); // -- setup prototype
    var myLayer = new myCustomCanvasDraw();
    myLayer.addTo(map);
    map.on("viewreset", reset);
    reset();
    // Reposition the SVG to cover the features. Mais do not care parce qu'on
    // a pas de svg et tout de facon c'etait tout moisi
    function reset() { }

    // communique par les services secrets de Charlie.. mais pourquoi mes calculs sont tout foireux ?
    // TODO use pro4j
    // NORD : 37.00270,-0.52535
    // WEST 36.74436,-0.56370
    // SUD 36.85814,-0.60707
    // EST 37.00559,-0.52753
    var boundsArray = [
        {
            southWest: L.latLng(-0.63466 , 36.70657),
            northEast: L.latLng(-0.82007, 37.26312 )
        }, {
            southWest: L.latLng(-0.63174 , 36.50179),
            northEast: L.latLng(-0.16380, 37.31485 )
        }, {
            southWest: L.latLng(-1.04606 , 37.07796),
            northEast: L.latLng(-0.62339, 36.57871)
        }
    ];


        var bounds = L.latLngBounds(boundsArray[1].southWest, boundsArray[2].southWest);
    map.fitBounds(bounds);
    //s : 37.31485 -0.16380 36.60179 -0.63174
    //tc : 36.57871 -0.62339 37.07796 -1.04606
    //m: 36.70657 -0.63466 37.26312 -0.82007