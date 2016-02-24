import L from 'leaflet';
var cloneLayer = require('leaflet-clonelayer');
require('leaflet.sync');

L.Control.Layers.Minimap = L.Control.Layers.extend({
  options: {
    position: 'topright',
    topPadding: 5,
    bottomPadding: 90,
    overlayBackgroundLayer: L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png', {
      attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a>' +
      ' &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })
  },


  initialize: function(baseLayers, overlays, options) {
    L.setOptions(this, options);

    this._layers = {};
    this._lastZIndex = 0;
    this._handlingClick = false;

    for (var i in baseLayers) {
      this._addLayer(baseLayers[i], i);
    }

    for (i in overlays) {
      this._addLayer(overlays[i].layer, i, true, overlays[i].showAsMiniMap);
    }
  },

  filter: function(string) {
    string = string.trim();

    var visibleLayers = {};
    var layerLabels = this._container.querySelectorAll('label');
    for (var i = 0; i < layerLabels.length; i++) {
      var layerLabel = layerLabels[i];

      if (string !== '' && layerLabel._layerName.indexOf(string) === -1) {
        L.DomUtil.addClass(layerLabel, 'leaflet-minimap-hidden');
      } else {
        L.DomUtil.removeClass(layerLabel, 'leaflet-minimap-hidden');
        visibleLayers[layerLabel._layerName] = cloneLayer(layerLabel._minimap._layer);
      }
    }
    this._onListScroll();

    return visibleLayers;
  },

  isCollapsed: function() {
    return !L.DomUtil.hasClass(this._container, 'leaflet-control-layers-expanded');
  },

  _expand: function() {
    debugger;
    L.Control.Layers.prototype._expand.call(this);
    this._onListScroll();
  },



  _initLayout: function() {
    var className = 'leaflet-control-layers',
    container = this._container = L.DomUtil.create('div', className);
    
    

    //Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
    container.setAttribute('aria-haspopup', true);

    if (!L.Browser.touch) {
      L.DomEvent
      .disableClickPropagation(container)
      .disableScrollPropagation(container);
    } else {
      L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
    }

    var closeDiv= L.DomUtil.create('div', 'close-btn');
    closeDiv.innerHTML='<i class="fa fa-times-circle-o"></i>';

    var formContainer = this._form = L.DomUtil.create('form', className + '-list');
    var form = this._form = L.DomUtil.create('div', className + '-container');
    formContainer.appendChild(closeDiv);

    if (this.options.collapsed) {
      if (!L.Browser.android) {
       // L.DomEvent.on(container, 'click', this._expand, this);
        //.on(container, 'mouseout', this._collapse, this);
      }
      var link = this._layersLink = L.DomUtil.create('div', className + '-toggle', container);
      link.title = 'Layers';

      if (L.Browser.touch) {

        L.DomEvent.on(link, 'click', L.DomEvent.stop).on(link, 'click', this._expand, this);
      } else {
        L.DomEvent.on(link, 'click', this._expand, this);
      }
      //Work around for Firefox android issue https://github.com/Leaflet/Leaflet/issues/2033
      L.DomEvent.on(form, 'click', function() {
        setTimeout(L.bind(this._onInputClick, this), 0);
      }, this);

     // this._map.on('click', this._collapse, this);
      // TODO keyboard accessibility
    } else {
      this._expand();
    }

    var title = L.DomUtil.create('div', 'leaflet-minimap-title', form);
    title.innerHTML = '<h4> Locations And Shapes</h4>';

    this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);
    this._separator = L.DomUtil.create('div', className + '-separator', form);

    title = L.DomUtil.create('div', 'leaflet-minimap-title', form);
    title.innerHTML = '<h4> Base Layers</h4>';


    this._baseLayersList = L.DomUtil.create('div', className + '-base', form);

    formContainer.appendChild(form);
    container.appendChild(formContainer);

    L.DomUtil.addClass(this._container, 'leaflet-control-layers-minimap');
    L.DomEvent.on(this._container, 'scroll', this._onListScroll, this);
    L.DomEvent.on(closeDiv, 'click', function(){
      this._collapse();
    }, this);

    L.DomEvent.disableClickPropagation(container).disableScrollPropagation(container);
    L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
    L.DomEvent.on(container, 'mousewheel', L.DomEvent.stopPropagation);

  },


  _onInputClick: function(e) {
    console.log('click');

    var i, input, obj,
    inputs = this._form.getElementsByTagName('input'),
    inputsLen = inputs.length;

    this._handlingClick = true;

    for (i = 0; i < inputsLen; i++) {
      input = inputs[i];
      obj = this._layers[input.layerId];

      if (input.checked && !this._map.hasLayer(obj.layer)) {
        this._map.addLayer(obj.layer);

      } else if (!input.checked && this._map.hasLayer(obj.layer)) {
        this._map.removeLayer(obj.layer);
      }
    }

    this._handlingClick = false;

    this._refocusOnMap();

  },

  _update: function() {
    L.Control.Layers.prototype._update.call(this);

    this._map.on('resize', this._onResize, this);
    this._onResize();

    this._map.whenReady(this._onListScroll, this);
  },


  addOverlay: function(layer, name, showAsMiniMap) {
    this._addLayer(layer, name, true, showAsMiniMap);
    this._update();
    return this;
  },

  _addLayer: function(layer, name, overlay, showAsMiniMap) {

    var id = L.stamp(layer);

    this._layers[id] = {
      layer: layer,
      name: name,
      overlay: overlay,
      showAsMiniMap: showAsMiniMap
    };

    if (this.options.autoZIndex && layer.setZIndex) {
      this._lastZIndex++;
      layer.setZIndex(this._lastZIndex);
    }
  },


  _addItem: function(obj) {

    if (obj.showAsMiniMap !== false) {
      this._addMiniMap(obj);

    } else {
      this._addLayerControl(obj);
    }


  },


  _addMiniMap: function(obj) {
    var container = obj.overlay ? this._overlaysList : this._baseLayersList;
    var label = L.DomUtil.create('div', 'leaflet-minimap-container', container);
    label._layerName = obj.name;
    var checked = this._map.hasLayer(obj.layer);

    label._minimap = this._createMinimap(
      L.DomUtil.create('div', 'leaflet-minimap', label),
      obj.layer,
      obj.overlay
      );


    var div = L.DomUtil.create('div', 'leaflet-minimap-label', label);

    var input;
    if (obj.overlay) {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'leaflet-control-layers-selector';
      input.defaultChecked = checked;
    } else {
      input = this._createRadioElement('leaflet-base-layers', checked);
    }

    input.layerId = L.stamp(obj.layer);
    input.id = 'check_' + L.stamp(obj.layer);

    div.appendChild(input);

    L.DomEvent.on(input, 'click', this._onInputClick, this);



    var name = L.DomUtil.create('label', '', div);
    name.htmlFor = input.id;

    name.innerHTML = ' ' + obj.name;

    return label;
  },


  _addLayerControl: function(obj) {
    var container = obj.overlay ? this._overlaysList : this._baseLayersList;
    var label = L.DomUtil.create('div', 'leaflet-minimap-container nopreview', container);
    label._layerName = obj.name;
    var checked = this._map.hasLayer(obj.layer);

    L.DomUtil.create('div', 'leaflet-minimap', label);

    var div = L.DomUtil.create('div', 'leaflet-minimap-label', label);

    var input;
    if (obj.overlay) {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'leaflet-control-layers-selector';
      input.defaultChecked = checked;
    } else {
      input = this._createRadioElement('leaflet-base-layers', checked);
    }

    input.layerId = L.stamp(obj.layer);
    input.id = 'check_' + L.stamp(obj.layer);

    div.appendChild(input);

    L.DomEvent.on(input, 'click', this._onInputClick, this);



    var name = L.DomUtil.create('label', '', div);
    name.htmlFor = input.id;

    name.innerHTML = ' ' + obj.name;

    return label;
  },

  _onResize: function() {
    var mapHeight = this._map.getContainer().clientHeight;
    var controlHeight = this._container.clientHeight;

    if (controlHeight > mapHeight - this.options.bottomPadding) {
      //this._container.style.overflowY = 'scroll';
    }
    this._container.style.maxHeight = (mapHeight - this.options.bottomPadding - this.options.topPadding) + 'px';
  },

  _onListScroll: function() {

    var minimaps = document.querySelectorAll('div[class="leaflet-minimap-container"]');
    if (minimaps.length === 0) {
      return;
    }

    var first, last;
    if (this.isCollapsed()) {
      first = last = -1;
    } else {

      var container = this._container;
      var scrollTop = container.scrollTop;

      var minimapHeight = minimaps.item(0).clientHeight;
      var listHeight = container.clientHeight;
      var titleHeight=container.querySelector('.leaflet-minimap-title').clientHeight;
      var separatorHeight=container.querySelector('.leaflet-control-layers-separator').clientHeight;

      var firstRow = Math.floor(scrollTop / minimapHeight);

      var mapsPerRow = Math.floor(container.clientWidth / minimaps.item(0).clientWidth);

      var start =  Math.floor(scrollTop / (minimapHeight+titleHeight +separatorHeight));
      var end =  Math.floor((scrollTop+listHeight-titleHeight-separatorHeight)/minimapHeight);

     first = start * mapsPerRow; //(3 number of map in row)
      last = end * mapsPerRow; //(3 number of map in row)

      console.log(start+' - '+end);
      /*
      var scrollTop = container.scrollTop;

      
      var lastRow = Math.ceil((scrollTop + listHeight) / minimapHeight);
     
      first = firstRow * mapsPerRow; //(3 number of map in row)
      last = lastRow * mapsPerRow; //(3 number of map in row)
      */

    }


    for (var i = 0; i < minimaps.length; ++i) {
      var minimap = minimaps[i].childNodes.item(0);
      var map = minimap._miniMap;
      if (map) {
        var layer = map._layer;

        if (!layer) {
          continue;
        }

        if (i >= first && i <= last) {
          if (!map.hasLayer(layer)) {
            layer.addTo(map);
          }
          map.invalidateSize();
        } else if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      }
    }
  },



  _createMinimap: function(mapContainer, originalLayer, isOverlay) {

    var minimap = mapContainer._miniMap = L.map(mapContainer, {
      attributionControl: false,
      zoomControl: false
    });

    if (!isOverlay) {
      // disable interaction.
      minimap.dragging.disable();
      minimap.touchZoom.disable();
      minimap.doubleClickZoom.disable();
      minimap.scrollWheelZoom.disable();
    }

    // create tilelayer, but do not add it to the map yet.
    if (isOverlay && this.options.overlayBackgroundLayer) {
      // add a background for overlays if a background layer is defined.
      minimap._layer = L.layerGroup([cloneLayer(this.options.overlayBackgroundLayer), cloneLayer(originalLayer)]);
    } else {
      minimap._layer = cloneLayer(originalLayer);
    }

    var map = this._map;

    map.whenReady(function() {
      if (isOverlay) {
        if (originalLayer.getBounds && originalLayer.getBounds().isValid()) {
          minimap.fitBounds(originalLayer.getBounds());
          if (minimap.getZoom() > 15) {
            minimap.setZoom(15);
          }

        } else {
          minimap.setView(map.getCenter(), map.getZoom());
        }
      } else {

        minimap.setView(map.getCenter(), map.getZoom());
        map.sync(minimap);
      }

    });

    return minimap;
  }
});

L.control.layers.minimap = function(baseLayers, overlays, options) {
  return new L.Control.Layers.Minimap(baseLayers, overlays, options);
};