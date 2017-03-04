function hover_map(){
        
        // construct the tooltip div
        mapTooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden');

    function findPos(obj) {
        var curleft = 0, curtop = 0;
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return { x: curleft, y: curtop };
        }
        return undefined;
    }

    function rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }


   $('#map_canvas2').mouseout(function(e){
        mapTooltip.style("visibility", "hidden");
   });

     $('#map_canvas2').mouseenter(function(e){
        mapTooltip.style("visibility", "visible");
   });

    $('#map_canvas2').mousemove(function(e) {
        var pos = findPos(this);
        var x = e.pageX - pos.x;
        var y = e.pageY - pos.y;
        var coord = "x=" + x + ", y=" + y;
        var ctx = document.getElementById('map_canvas').getContext("2d");
        var p = ctx.getImageData(x, y, 1, 1).data; 
        var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);

        //Connect with chosenColorscale
        chosenColorscale[1].forEach((el, i) => {
            if (hex == chosenColorscale[1][i]){
                
                mapTooltip.style("top", (e.pageY-10)+"px").style("left",(e.pageX+10)+"px");
                mapTooltip.html(chosenColorscale[2][i]);

            }
        });  
    });

}