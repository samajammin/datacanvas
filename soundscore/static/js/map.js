/**
 * Created by samrichards on 3/20/15.
 */

        L.mapbox.accessToken = 'pk.eyJ1Ijoic2FtYnJpY2hhcmRzIiwiYSI6Ilk0VTVlaTQifQ.HvqYSkhL-Rwj7sp-hkS4bg';


        var map = L.mapbox.map('map', 'sambrichards.lcknl6d4', {
            scrollWheelZoom: false,
            legendControl: {
                position: 'bottomleft'
            }
        });

//                standard markers
        var sensorLayer = L.mapbox.featureLayer().addTo(map);

        $.getJSON( "/api/locations/", function( data ) {
            var gjson = [
                {
                  "type": "FeatureCollection",
                  "features": []
                }
                ];


            function getScore(decibels){
                if(decibels < 50){
                    return [1, "#FFE380"];
                }
                else if(decibels >= 50 && decibels < 60){
                    return [2, "#FFC700"];
                }
                else if(decibels >= 60 && decibels < 70){
                    return [3, "#FFA40C"];
                }
                else if(decibels >= 70 && decibels < 80){
                    return [4, "#F9452A"];
                }
                else {
                    return [5, "#F2093C"];
                }
            }


            for(i=0; i < data.length; i++){
                var feature = {
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [
                      data[i].longitude,
                      data[i].latitude
                    ]
                  },
                  "properties": {
                      // todo newline
                    "title": data[i].sensor,
                            //"SensorID: #" + data[i].sensor + ", \n"
                            //+ "Location: (" + data[i].longitude + " , " + data[i].latitude + ") + \n"
                            //+ "SoundScore: " + getScore(data[i].avg_sound)[0] + "\n",
                    "id": data[i].sensor,
//                    "marker-color": "#9c89cc",
                    "marker-color": getScore(data[i].avg_sound)[1],
//                    "marker-size": "small",
                    "avg_sound": data[i].avg_sound,
                    "score": getScore(data[i].avg_sound)[0]
                  }
                };
                gjson[0].features.push(feature);
            }

            sensorLayer.setGeoJSON(gjson);

            // tooltips on hover
            //sensorLayer.on('mouseover', function(e) {
            //    e.layer.openPopup();
            //});
            //sensorLayer.on('mouseout', function(e) {
            //    e.layer.closePopup();
            //});

            // disables tooltip
            sensorLayer.on('click', function(e) {
                e.layer.closePopup();
            });

//                circle markers
//            var sensorLayer = L.geoJson(gjson, {
//                pointToLayer: function(feature, latlng) {
//                    return L.circleMarker(latlng, {
//                        radius: feature.properties.avg_sound / 5,
//                        fill: black;
//                    })
//                }
//            }).addTo(map);

            map.legendControl.addLegend('<h6>Filter By SoundScore:</h6><ul id="filters" class="filter-ui list-inline"></ul>');

            map.fitBounds(sensorLayer.getBounds());

            // Disable drag and zoom handlers.
            map.dragging.disable();
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();

            // Disable tap handler, if present.
            if (map.tap) map.tap.disable();


            // todo add img filters & color scale
            // filter markers
            var filters = document.getElementById('filters');
              var typesObj = {}, types = [1,2,3,4,5];

              var features = gjson[0].features;
              for (var i = 0; i < features.length; i++) {
                typesObj[features[i].properties['score']] = true;
              }

              var checkboxes = [];
              // Create a filter interface.
              for (var j = 0; j < types.length; j++) {
                // Create an an input checkbox and label inside.
                var item = filters.appendChild(document.createElement('li'));
                var checkbox = item.appendChild(document.createElement('input'));
                var label = item.appendChild(document.createElement('label'));
                checkbox.type = 'checkbox';
                checkbox.id = types[j];
                checkbox.checked = true;
                // create a label to the right of the checkbox with explanatory text
                label.innerHTML = types[j];
                label.setAttribute('for', types[j]);
                // Whenever a person clicks on this checkbox, call the update().
                checkbox.addEventListener('change', update);
                checkboxes.push(checkbox);
              }

              // This function is called whenever someone clicks on a checkbox and changes
              // the selection of markers to be displayed.
              function update() {
                var enabled = {};
                // Run through each checkbox and record whether it is checked. If it is,
                // add it to the object of types to display, otherwise do not.
                for (var i = 0; i < checkboxes.length; i++) {
                  if (checkboxes[i].checked) enabled[checkboxes[i].id] = true;
                }
                sensorLayer.setFilter(function(feature) {
                  // If this symbol is in the list, return true. if not, return false.
                  // The 'in' operator in javascript does exactly that: given a string
                  // or number, it says if that is in a object.
                  // 2 in { 2: true } // true
                  // 2 in { } // false
                  return (feature.properties['score'] in enabled);
                });
              }


        });
