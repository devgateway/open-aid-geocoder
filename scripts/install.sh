#!/bin/bash
echo "******************************"
echo "* Installing geocoder plugin *"
echo "******************************"

curl -fsSLO "https://github.com/devgateway/open-aid-geocoder/archive/windows-local.zip"

unzip windows-local.zip

rm windows-local.zip

mv open-aid-geocoder-windows-local open-aid-geocoder

cd open-aid-geocoder

npm install

cd api

npm install

cd ../..

cp open-aid-geocoder/scripts/start.sh .

