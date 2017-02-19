install.packages(c("sp", "raster", "rgeos","rgdal"))
                   
library(raster)

x <- raster(system.file("Desktop/Pdm/webviz_scripts/webviz_natcap/data/initial_maps/maragua_base_lulc.tif", package="raster"))

#make all vlaues the same 
r <- x > -Inf

# convert to polygons (you need to have package 'rgeos' installed for this to work)
pp <- rasterToPolygons(r, dissolve=TRUE)

#results
plot(x)
plot(p, lwd=5, border='red', add=TRUE)
plot(pp, lwd=3, border='blue', add=TRUE)