#!/bin/bash
echo "******************************"
echo "* Installing geocoder plugin *"
echo "******************************"

wget "https://github.com/devgateway/open-aid-geocoder/archive/windows-local.zip"

unzip windows-local.zip

rm windows-local.zip

mv open-aid-geocoder-windows-local open-aid-geocoder

npm install

cd open-aid-geocoder/api

npm install

cd ../..

mv open-aid-geocoder/scripts/start.sh .

