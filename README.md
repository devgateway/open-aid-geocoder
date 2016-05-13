Open Aid Geocoder
=====================

This tools allow users to attach geographical information to existing aid projects. 
 The project supports 
* hot reloading React components;
* error handling inside component `render()` function;
* error handling for syntax errors 

#Demo
http://devgateway.github.io/open-aid-geocoder

#Development

```
gulp 

```
##Production build
```
gulp build-prod

```

##gh_pages deployment
```
gulp deploy

``` 

Running gulp without target will build the project using web pack development configuration and will start an express web server.
 
Run gulp build-prod to build a distributable application.

Run gulp deploy to push dist folder into gh_pages branch 

##Copyright

Copyright 2015-2016 Development Gateway

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## Local Install

1 - Install node on your local computer, download it from https://nodejs.org/en/download/.

2 - Make sure node is installed correctly, Open a terminal and type the following commands:
``` 
node -v
npm -v
```
	The output of these command should look like:
```
$ node -v
v4.4.3
$ npm -v
2.15.1
```
3 - Create an empty folder where you want to install it.

4 - Download the following file and save it on the empty folder: 

https://github.com/devgateway/open-aid-geocoder/blob/windows-local/scripts/update.sh

https://github.com/devgateway/open-aid-geocoder/blob/windows-local/scripts/install.sh

	To save the files, right click on the url and select "save link as" option.
5 - Run the scripts.

5.1 -  Open a Terminal.

5.2 - Browser to the install folder. (i.e: cd /path-to-folder).

5.3 - Run the following commands to add execute permision:
``` 
chmod +x update.sh
chmod +x install.sh
```
5.4 - Run update command.
```
./update.sh
```
5.5 - Run install command.
```
./install.sh
```
6 - The tool should work locally The empty folder shall contain *start.sh* file and *open-aid-geocoder* folder.

6.1 - Add execute permision:
``` 
chmod +x start.sh
```
6.2 - Run the application:
```
./start.sh 
```
7 - A new browser shall be open with the tool.

8 - The projects shall be save in:
```
open-aid-geocoder/api/data/project-data.json
```
8.1 - You could delete or rename it in order to clean the projects.

9 - You could add more project by import them.

9.1 - Open the following file:
```
open-aid-geocoder/import.html
```
9.2 - Select the file with projects to import. It must have the following format:

project_id    | title         | long_description
--- | --- | ---
123           | Mafambisse Sugar Rehabilitation Test | The project aims at restoring and sustaining the productive capacity of the Mafambisse plantation and factory.
1234          | Cashew Rehabilitation Project      | The objective of the project is to increase the production of raw cashew nuts

9.3 - Click on the import button and you could start using them.

10 - To export the project to GeoJson. Right click on the following url and select "save link as" option.

[http://localhost:3333/export](http://localhost:3333/export)

