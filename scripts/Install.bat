@echo off
echo "******************************"
echo "* Installing geocoder plugin *"
echo "******************************"

powershell -Command "Invoke-WebRequest https://github.com/devgateway/open-aid-geocoder/archive/windows-local.zip -OutFile tmp.zip"

powershell -nologo -noprofile -command "& { Add-Type -A 'System.IO.Compression.FileSystem'; [IO.Compression.ZipFile]::ExtractToDirectory('tmp.zip', 'tmp'); }"

del tmp.zip

move tmp\open-aid-geocoder-windows-local .

del tmp

cd open-aid-geocoder-windows-local

npm install

cd api

npm install
