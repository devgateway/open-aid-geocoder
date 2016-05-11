

@echo off
    for /R "./" %%f in (*.shp) do (
     	@echo Working on %%~nf
      ogr2ogr   -progress -skipfailures  -s_srs crs:84 -f GeoJSON -t_srs crs:84 %%~nf.geojson "%%f"
)



 

