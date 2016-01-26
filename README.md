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


##npm build
```
git clone 
cd  
npm install
npm run build
npm start 
open http://localhost:3000
```

##gulp build
```
npm install gulp -G
npm install 
gulp 
```

##Production build
```
npm install gulp -G
npm install 
gulp build-prod
```

##gh_pages deployment
```
gulp deploy

``` 

Running gulp without target will build the project using web pack development configuration and will start an express web server.
 
Run gulp build-prod to build a distributable application.

Run gulp deploy to push dist folder into gh_pages branch 