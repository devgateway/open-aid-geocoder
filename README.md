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
1- Install node on your pc, download it from https://nodejs.org/en/download/
2- Create an empty folder where you want to install it
3- Download the following file and save it on the empty folder: 
	https://github.com/devgateway/open-aid-geocoder/blob/windows-local/scripts/update.sh
	https://github.com/devgateway/open-aid-geocoder/blob/windows-local/scripts/install.sh
4- Run update.sh
5- Run install.sh
6- The tool should work locally, run start.sh to start.

