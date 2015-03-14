'use strict';

/**
 * @ngdoc function
 * @name soundscoreangularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the soundscoreangularApp
 */
angular.module('soundscoreangularApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var mapTiles = {
        openstreetmap: {
            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            options: {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        },
        opencyclemap: {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            options: {
                attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
            }
        },
        darkmap: {
            //url: "http://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FtYnJpY2hhcmRzIiwiYSI6Ilk0VTVlaTQifQ.HvqYSkhL-Rwj7sp-hkS4bg",
            url: "http://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FtYnJpY2hhcmRzIiwiYSI6Ilk0VTVlaTQifQ.HvqYSkhL-Rwj7sp-hkS4bg",
            options: {
                attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox © OpenStreetMap</a>'
            }
        },
        lightmap: {
            //url: "http://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FtYnJpY2hhcmRzIiwiYSI6Ilk0VTVlaTQifQ.HvqYSkhL-Rwj7sp-hkS4bg",
            url: "http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FtYnJpY2hhcmRzIiwiYSI6Ilk0VTVlaTQifQ.HvqYSkhL-Rwj7sp-hkS4bg",
            options: {
                attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox © OpenStreetMap</a>'
            }
        },
        mymap: {
            //url: "http://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FtYnJpY2hhcmRzIiwiYSI6Ilk0VTVlaTQifQ.HvqYSkhL-Rwj7sp-hkS4bg",
            url: "http://api.tiles.mapbox.com/v4/sambrichards.lcknl6d4/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FtYnJpY2hhcmRzIiwiYSI6Ilk0VTVlaTQifQ.HvqYSkhL-Rwj7sp-hkS4bg",
            options: {
                attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox © OpenStreetMap</a>'
            }
        }
    };
    angular.extend($scope, {
        center: {
            lat: 37.767358,
            lng: -122.430467,
            zoom: 12
        },
        //"http://api.tiles.mapbox.com/v4/sambrichards.lcknl6d4/0/0/0.png?access_token=pk.eyJ1Ijoic2FtYnJpY2hhcmRzIiwiYSI6Ilk0VTVlaTQifQ.HvqYSkhL-Rwj7sp-hkS4bg",
        tiles: mapTiles.mymap,
        defaults: {
            scrollWheelZoom: false
        }
    });
    //    pull in locations

    $http.get("http://localhost:8000/api/locations/").success(function(data, status) {
        console.log(data);
        //var myIcon = {  iconUrl:'images/mapPinRed.png',
        //                iconSize:[25, 25],
        //                iconAnchor:[12, 0]})
        //            };
        var geojson_data = { "type": "FeatureCollection",
                                "features": [
                                  { "type": "Feature",
                                    "geometry": {"type": "Point", "coordinates": [data[0]['latitude'], data[0]['longitude']]},
                                    "properties": {"prop0": "value0"}
                                    },
                                  { "type": "Feature",
                                    "geometry": {"type": "Point", "coordinates": [data[1]['latitude'], data[1]['longitude']]},
                                    "properties": {"prop0": "value0"}
                                    }
                                   ]
                            };
        //    todo need to format location data into geojson
            angular.extend($scope, {
                geojson: {
                    data: geojson_data
                    //style: {
                    //    fillColor: "green",
                    //    weight: 2,
                    //    opacity: 1,
                    //    color: 'white',
                    //    dashArray: '3',
                    //    fillOpacity: 0.7
                    //}
                    //style:
                    //    function (feature) {return {};},
                    //    pointToLayer: function(feature, latlng) {
                    //        return new L.marker(latlng, {icon: L.icon(myIcon)});
                    //    },
                    //    onEachFeature: function (feature, layer) {
                    //        layer.bindPopup("number: " +feature.properties.something);
                    //    }
                },
                markers: {
                        myMarker: {
                            lat: data[0]['latitude'],
                            lng: data[0]['longitude'],
                            //manessage: "()",
                            //focus: true,
                            draggable: false
                        },
                        myMarker2: {
                            lat: data[1]['latitude'],
                            lng: data[1]['longitude'],
                            //message: "()",
                            //focus: true,
                            draggable: false
                        }
                    }
                });
        //}
        });

  });
