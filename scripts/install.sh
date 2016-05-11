
echo "******************************"
echo "* Installing geocoder plugin *"
echo "******************************"

wget "https://github.com/devgateway/open-aid-geocoder/archive/windows-local.zip"

unzip windows-local.zip

#rm windows-local.zip

mv open-aid-geocoder-windows-local .

rm -r open-aid-geocoder-windows-local

npm install

cd api

npm install

cd ..\..

mv scripts\Start.bat .
