/**
 * Created by samrichards on 3/16/15.
 */

var dowChart = dc.rowChart("#dow-chart");
//var monthRingChart   = dc.pieChart("#chart-ring-month");
//var sensorRingChart   = dc.pieChart("#chart-ring-sensor");
var hourPie = dc.pieChart("#hour-pie");
//var singleHourRingChart   = dc.pieChart("#singlehour-ring-chart");
//var datatable = dc.dataTable("#dc-data-table");
//var hoursChart  = dc.lineChart("#chart-line-soundperhour");
//var hodChart = dc.barChart('#hod-chart');
var sensorBubbleChart = dc.bubbleChart('#sensor-bubble-chart');
var dateBarChart  = dc.barChart("#date-chart");

console.log($(window).width());

//d3.json("../static/js/newhours.json", function(data){
d3.json("/api/hours/?count=10000", function(data){
    var api_data = data['results'];
            //console.log('hour results received')
            //console.log(api_data.length);
//            console.log(api_data);

//        sample data object from the api_data array
//       {
//            "id": 1,
//            "hour": "2015-01-14T00:23:50",
//            "sound_avg": 79.8006268656716,
//            "sound_min": 63.2144,
//            "sound_max": 96.1416,
//            "sound_std": 56.7724694981303,
//            "sound_var": 3693.79598253509,
//            "sound_count": 480,
//            "sensor": 1
//        },

    var cf = crossfilter(api_data);

    //custom reduce functions for avg attributes
    function reduceAddAvg(att) {
        return function(p, v) {
            ++p.count;
            p.total += v[att];
            if (p.count > 0) {
                p.avg = p.total / p.count;
            }
            else {
                p.avg = 0;
            }

            return p;
        };
    }

    function reduceRemoveAvg(att) {
        return function(p, v) {
            --p.count;
            p.total -= v[att];
            if (p.count > 0) {
                p.avg = p.total / p.count;
            }
            else {
                p.avg = 0;
            }
            return p;
        };
    }

    function reduceInitialAvg() {
        return {count: 0, total: 0, avg:0};
    }

    // reduce functions for sound attributes
    function reduceAdd(p, v) {
        ++p.count;
        p.avg_total += v['sound_avg'];
        if (p.count > 0) { p.avg = p.avg_total / p.count;}
        else { p.avg = 0;}
        p.std_total += v['sound_std'];
        if (p.count > 0) { p.std_avg = p.std_total / p.count;}
        else { p.std_avg = 0;}
        return p;
    }

    function reduceRemove(p, v) {
        --p.count;
        p.avg_total -= v['sound_avg'];
        if (p.count > 0) { p.avg = p.avg_total / p.count;}
        else { p.avg = 0;}
        p.std_total -= v['sound_std'];
        if (p.count > 0) { p.std_avg = p.std_total / p.count;}
        else { p.std_avg = 0;}
        return p;
    }


    function reduceInitial() {
        return {count: 0, avg_total: 0, avg:0, std_total:0, std_avg:0};
    }


    var numberFormat = d3.format('.2f');
    //var numberFormatZero = d3.format('f');
    var parseHour = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
    api_data.forEach(function(d) {
        d.hour = parseHour(d.hour);
        d.hod = d.hour.getHours();
        d.month= d.hour.getMonth();
        d.dow = d.hour.getDay();
        d.date = d3.time.day(d.hour);
    });

    //var feb = "2015-02-14T00:23:50"
    //var february = parseHour(feb);
    //console.log(feb);
    //console.log(february);
    //console.log(d3.time.month(february));

    <!-- todo clean up dimensions, all in one place & only the ones we need -->
    var sensorDim = cf.dimension(function(d) { return d.sensor; });
    var hourDim = cf.dimension(function(d) { return d.hour;});
    var monthDim  = cf.dimension(function(d) {return d.month;});
    var dowDim  = cf.dimension(function(d) {return d.dow;});
    var hodDim  = cf.dimension(function(d) {return d.hod;});
    var dateDim  = cf.dimension(function(d) {return d.date;});

    var hourGroupDim = cf.dimension(function (d) {
        var hr = d.hod;
        if (hr <= 2) {
            return 0
        } else if (hr > 2 && hr <= 5) {
            return 1
        } else if (hr > 5 && hr <= 8) {
            return 2
        } else if (hr > 8 && hr <= 11) {
            return 3
        } else if (hr > 11 && hr <= 14) {
            return 4
        } else if (hr > 14 && hr <= 17) {
            return 5
        } else if (hr > 17 && hr <= 20) {
            return 6
        } else {
            return 7
        }
    });

    //var monthTotal = monthDim.group().reduceSum(function(d) {return d.sound_avg;});
    //var hodTotal = hodDim.group().reduceSum(function(d) {return d.sound_avg;});
    //var dateTotal = dateDim.group().reduceSum(function(d) {return d.sound_avg;});
    //var dowTotal = dowDim.group().reduceSum(function(d) {return d.sound_avg;});
    //var dowCount = dowDim.group().reduceCount(function(d) {return d.sound_avg;});

    var dowAvg = dowDim.group().reduce(reduceAddAvg('sound_avg'), reduceRemoveAvg('sound_avg'), reduceInitialAvg);
    var hodAvg = hodDim.group().reduce(reduceAddAvg('sound_avg'), reduceRemoveAvg('sound_avg'), reduceInitialAvg);
    var dateAvg = dateDim.group().reduce(reduceAddAvg('sound_avg'), reduceRemoveAvg('sound_avg'), reduceInitialAvg);
    //var hourAvg = hourDim.group().reduce(reduceAddAvg('sound_avg'), reduceRemoveAvg('sound_avg'), reduceInitialAvg);
    var sensorAvg = sensorDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);
    //var hourGroup = hourGroupDim.group().reduce(reduceAddAvg('sound_avg'), reduceRemoveAvg('sound_avg'), reduceInitialAvg);
    //var hourGroup = hourGroupDim.group().reduceCount(function(d) {return d.sound_avg;});
    var hourGroup = hourGroupDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);
    var hodGroup = hodDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);

    //console.log(hourGroup.all());

    var dayOfWeekNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    //var monthOfYear = ["Jan", "Feb", "March", "April"];
    var hodBuckets = ["12AM - 3AM","3AM - 6AM","6AM - 9AM","9AM - 12PM","12PM - 3PM","3PM - 6PM","6PM - 9PM", "9PM - 12PM"];

//            count of this should be 969, not 12... right?
//    var sound = hourDim.group().reduceSum(function(d) {return d.sound_avg;});
//    var soundMax = hourDim.group().reduceSum(function(d) {return d.sound_max;});
//    var soundMin = hourDim.group().reduceSum(function(d) {return d.sound_min;});
//    var soundCount = hourDim.group().reduceSum(function(d) {return d.sound_count;});
//    var minHour = hourDim.bottom(1)[0].hour;
//    var maxHour = hourDim.top(1)[0].hour;
    //var minMonth = monthDim.bottom(1)[0].month;
    //var maxMonth = monthDim.top(1)[0].month;
    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;

    //var sensorTotal = sensorDim.group().reduceSum(function(d) {return d.sound_avg;});

    dowChart
          .width($( "#dow-chart-col" ).width())
          //.height($( "#dow-chart" ).height())
          .height(300)
          .margins({top: 10, left: 20, right: 10, bottom: 20})
//              .group(dowDim.group())
          .group(dowAvg)
          .dimension(dowDim)
          .label(function (d) {
              return dayOfWeekNames[d.key];
          })
            .colors(colorbrewer.SdSc[5])
            .colorDomain([74, 76])
            .renderTitle(true)
            .title(function (p) {
                return 'Average Noise: ' + numberFormat(p.value.avg) + ' dB';
            })
            .labelOffsetX(2100)
            .colorAccessor(function(d, i){return d.value.avg;})
            //had to hack around to get xaxis scale to work:
            //https://groups.google.com/forum/#!topic/dc-js-user-group/zg_MgogXs2Y
            .x(d3.scale.linear().range([0,300]).domain([70,80]))

          //.elasticX(true)
          .xAxis().ticks(5);

    dowChart.valueAccessor(function(p) {return p.value.avg; });

    //monthRingChart
    //    .width(300).height(300)
    //    .dimension(monthDim)
    //    .group(monthDim.group())
    //    .label(function (d) {
    //      return monthOfYear[d.key];
    //    })
    //    .innerRadius(30);
    //
    //sensorRingChart
    //    .width(300).height(300)
    //    .dimension(sensorDim)
    //    .group(sensorDim.group())
    //    .innerRadius(60);


    hourPie
        //.width(275)
        .width($( "#hour-pie-col" ).width())
        .height(300)
        .dimension(hourGroupDim)
        .group(hourGroup)
        .innerRadius(30)
        //.colors(colorbrewer.RdBu[8])
        .colors(colorbrewer.SdSc[5])
        .colorDomain([74, 76.5])
        .label(function (d) {
              return hodBuckets[d.key];
          })
        .renderTitle(true)
        .title(function (p) {
            return [
                p.key,
                'Average Noise: ' + numberFormat(p.value.avg) + ' dB'
            ].join('\n');
        })
        //.order(d3.ascending)
        .colorAccessor(function(d, i){return d.value.avg;});



    hourPie.valueAccessor(function(p) {return p.value.avg; });
    //hourPie.sort(d3.ascending);

    //singleHourRingChart
    //    .width(300).height(300)
    //    .dimension(hodDim.group())
    //    .group(hodGroup)
    //    .innerRadius(30)
    //    .colors(colorbrewer.RdBu[8])
    //    //.colors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
    //    // (optional) define color domain to match your data domain if you want to bind data or color
    //    .colorDomain([74, 76])
    //    .renderTitle(true) // (optional) whether chart should render titles, :default = false
    //    .renderLabel(true)
    //    .title(function (p) {
    //        return [
    //            p.key,
    //            'Average Noise: ' + numberFormat(p.value.avg) + ' dB'
    //        ].join('\n');
    //    })
    //    // (optional) define color value accessor
    //    .colorAccessor(function(d, i){return d.value.avg;});
    //
    //singleHourRingChart.valueAccessor(function(p) {return p.value.avg; });


    //#### Bar Chart
    // Create a bar chart and use the given css selector as anchor. You can also specify
    // an optional chart group for this chart to be scoped within. When a chart belongs
    // to a specific group then any interaction with such chart will only trigger redraw
    // on other charts within the same chart group.
    /* dc.barChart('#volume-month-chart') */
    //hodChart
    //    .width(300)
    //    .height(300)
    //    .margins({top: 10, right: 50, bottom: 30, left: 40})
    //    .dimension(hodDim)
    //    .group(hodAvg)
    //    .elasticY(true)
    //    //.y(d3.scale.linear().domain([60, 90]))
    //    // (optional) set gap between bars manually in px, :default=2
    //    .gap(1)
    //    // (optional) set filter brush rounding
    //    .round(dc.round.floor)
    //    .alwaysUseRounding(true)
    //    .x(d3.scale.linear().domain([0, 23]))
    //    .renderHorizontalGridLines(true);
    //
    //hodChart.valueAccessor(function(p) {return p.value.avg; });


    dateBarChart
        //.width(600)
        .width($( "#date-chart-col" ).width())
        .height(300)
        //.margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(dateDim)
        .group(dateAvg)
        .round(dc.round.floor)
        .alwaysUseRounding(true)
        .brushOn(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .y(d3.scale.linear().domain([60, 90]))
        //.filter([d3.time.month(parseHour("2015-02-14T00:23:50")),d3.time.month(parseHour("2015-03-14T00:23:50"))])
        //.legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
        //.elasticY(true)
        .gap(3)
        .colors(["#424242"])
        .yAxisLabel("Decibels");

    dateBarChart.valueAccessor(function(p) {return p.value.avg; });


        // customize the filter displayed in the control span
        //.filterPrinter(function (filters) {
        //    var filter = filters[0], s = '';
        //    s += numberFormat(filter[0]) + '% -> ' + numberFormat(filter[1]) + '%';
        //    return s;
        //});

    // Customize axis
    //fluctuationChart.xAxis().tickFormat(
    //    function (v) { return v + '%'; });
    //fluctuationChart.yAxis().ticks(5);

    dateBarChart.xUnits(function(){return 60;});

//            var tableGroup = monthDim.group().reduce(
//              function reduceAddAvg(p,v) {
//                p[v.status] = v.hits;
//                p["Year"]= v.Year;
//                return p;
//              },
//              function reduceRemoveAvg(p,v) {
//                p[v.status] = 0;
//                p["Year"]=v.Year;
//
//                return p;
//              },
//              function reduceInitialAvg() { return {}; }
//              );



    //datatable
    //    .dimension(hourDim)
    //    .group(function(d) {return d.hour;})
    //    // dynamic columns creation using an array of closures
    //    .columns([
    //        function(d) {return d.hour;},
    //        function(d) {return d.sound_avg;},
    //        function(d) {return d.sound_max;},
    //        function(d) {return d.sound_min;},
    //        function(d) {return d.sound_count;}
    //    ]);






<!-- todo get brush filter working -->
//    hoursChart
//        .width(1000).height(300)
//        .dimension(hourDim)
//        //.brushOn(true)
//        .group(hourAvg)
//        .x(d3.time.scale().domain([minHour,maxHour]))
//        .y(d3.scale.linear().domain([60, 90]))
//        //.compose([
//            //dc.lineChart(hoursChart).group(hourAvg, "Avg"),
//            //dc.lineChart(hoursChart).group(soundMax, "Max"),
//            //dc.lineChart(hoursChart).group(soundMin, "Min")
////                    dc.lineChart(hoursChart).group(soundCount, "Count")
////        ])
//        .legend(dc.legend().x(950).y(10).itemHeight(13).gap(5))
//            //                    todo elastic X doesn't work, I assume due to domain set to minHour/maxHour
//        .elasticX(true)
//        //.elasticY(true)
//        .yAxisLabel("Decibels");
////                .xAxisLabel("Date");
//
//    //todo this type of chart must work differently with value (multiple lines)
//    hoursChart.valueAccessor(function(p) {return p.value.avg; });


    //#### Bubble Chart
    //Create a bubble chart and use the given css selector as anchor. You can also specify
    //an optional chart group for this chart to be scoped within. When a chart belongs
    //to a specific group then any interaction with such chart will only trigger redraw
    //on other charts within the same chart group.
    /* dc.bubbleChart('#yearly-bubble-chart', 'chartGroup') */
    //    todo figure out .colr/ key /value accessors
    sensorBubbleChart
        //.width(360) // (optional) define chart width, :default = 200
        .width($( "#bubble-chart-col" ).width())
        .height(300)  // (optional) define chart height, :default = 200
        .transitionDuration(1500) // (optional) define chart transition duration, :default = 750
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(sensorDim)
        //Bubble chart expect the groups are reduced to multiple values which would then be used
        //to generate x, y, and radius for each key (bubble) in the group
        .group(sensorAvg)
        //.colors(colorbrewer.RdYlGn[9]) // (optional) define color function or array for bubbles
        //.colorDomain([70, 90]) //(optional) define color domain to match your data domain if you want to bind data or
        .colors(colorbrewer.SdSc[5]) // (optional) define color function or array for bubbles
        .colorDomain([70, 90]) //(optional) define color domain to match your data domain if you want to bind data or
        //##### Accessors
        //Accessor functions are applied to each value returned by the grouping
        //
        //* `.colorAccessor` The returned value will be mapped to an internal scale to determine a fill color
        //* `.keyAccessor` Identifies the `X` value that will be applied against the `.x()` to identify pixel location
        //* `.valueAccessor` Identifies the `Y` value that will be applied agains the `.y()` to identify pixel location
        //* `.radiusValueAccessor` Identifies the value that will be applied agains the `.r()` determine radius size,
        //*     by default this maps linearly to [0,100]
        .colorAccessor(function (d) {
            return d.value.avg;
        })
        .keyAccessor(function (p) {
            return p.value.avg;
        })
        .valueAccessor(function (p) {
            return p.value.std_avg;
        })
        .radiusValueAccessor(function (p) {
            return p.value.count/2;
        })
        .maxBubbleRelativeSize(0.3)
        .x(d3.scale.linear().domain([70, 90]))
        .y(d3.scale.linear().domain([40, 70]))
        .r(d3.scale.linear().domain([0, 4000]))
        //.elasticY(true)
        //.elasticX(true)
        .yAxisPadding(100)
        .xAxisPadding(500)
        .renderHorizontalGridLines(true) // (optional) render horizontal grid lines, :default=false
        .renderVerticalGridLines(true) // (optional) render vertical grid lines, :default=false
        .xAxisLabel('Average Noise Level') // (optional) render an axis label below the x axis
        .yAxisLabel('Noise SD') // (optional) render a vertical axis lable left of the y axis
        .renderLabel(true) // (optional) whether chart should render labels, :default = true
        .label(function (p) {
            return p.key;
        })
        .renderTitle(true) // (optional) whether chart should render titles, :default = false
        .title(function (p) {
            return [
                'Sensor: ' + p.key,
                'Average Noise: ' + numberFormat(p.value.avg) + ' dB',
                'Noise STD: ' + numberFormat(p.value.std_avg),
                'Total Measurements: ' + numberFormat(p.value.count)
            ].join('\n');
        })
        .yAxis()
            .tickFormat(function (v) {
            return v;
        });




    dc.renderAll();

    // todo filter on map clicks
    $('.leaflet-marker-icon').on('click', function(e){
        console.log(e);
        console.log(parseInt(e.target.attributes.title.nodeValue));
        var sensorClicked = parseInt(e.target.attributes.title.nodeValue)
        sensorBubbleChart.filterAll();
        sensorBubbleChart.filter(sensorClicked);
        dc.redrawAll();
        //var minDate = tripsByDateDimension.top(5)[4].startDate;
        //var maxDate = tripsByDateDimension.top(5)[0].startDate;
        //console.log(tripVolume.filters());
        //
        //
        //tripVolume.filter([minDate, maxDate]);
        //tripVolume.x(d3.time.scale().domain([minDate,maxDate]));
        //
        //console.log(tripVolume.filters());

    });

});