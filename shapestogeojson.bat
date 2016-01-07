
@echo off
    for /R "//" %%f in (*.shp) do (
    echo %%~nf
)
pause


 rem ogr2ogr -f GeoJSON -t_srs crs:84 "$1.geojson" %%i


