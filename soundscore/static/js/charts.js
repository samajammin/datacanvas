/**
 * Created by samrichards on 3/16/15.
 */

var dowChart = dc.rowChart("#dow-chart");
var monthRingChart   = dc.pieChart("#chart-ring-month");
var sensorRingChart   = dc.pieChart("#chart-ring-sensor");
var datatable = dc.dataTable("#dc-data-table");
var hoursChart  = dc.compositeChart("#chart-line-soundperhour");
var hodChart = dc.barChart('#hod-chart');
//var sensorBubbleChart = dc.bubbleChart('#sensor-bubble-chart');
var dateBarChart  = dc.barChart("#date-chart");

//        d3.json("http://127.0.0.1:8000/api/measurements/?count=923", function(data){
d3.json("../static/js/newhours.json", function(data){
    var api_data = data['results'];
//            console.log(api_data.length);
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
//            console.log(cf);

//            totals
//            var soundTotal = cf.groupAll().reduceSum(function(d) {return d.sound_avg;}).value();
//            console.log("soundTotal: " + soundTotal);
//
//            var soundCount = cf.groupAll().reduceCount().value();
//            console.log("soundCount: " + soundCount);
//
//            var soundAvg = soundTotal / soundCount;
//            console.log("soundAvg: " + soundAvg);

//            var soundMax = cf.groupAll().reduce

    <!-- todo clean up dimensions, all in one place & only the ones we need -->
//            DIMENSIONS
    var soundAvgDim = cf.dimension(function(d) { return d.sound_avg; });
    var sensorDim = cf.dimension(function(d) { return d.sensor; });



//    GROUPS

//            filtering before a group method only works when you create another variable... if I call this on sensorDim the for loop returns all sensor
//            var sensorFilterDim = cf.dimension(function(d) { return d.sensor; });
//            sensorFilterDim.filter(2);

    var countSensor = sensorDim.group().reduceCount();
    console.log("countSensor:");
    console.log(countSensor);
    console.log("countSensor size: " + countSensor.size());
    var all = countSensor.all();

    var sumSensor = sensorDim.group().reduceSum(function(d) {return d.sound_avg;});
    console.log("sumSensor:");
    console.log(sumSensor);
    console.log("sumSensor size: " + sumSensor.size());
    var allsum = sumSensor.all();

//              reduce creates nice key/value pairs:
    for(i = 0; i < sumSensor.size(); i++){
//                var sensorCount = sensorDim.filter(i).top(Infinity);
//                console.log("Sensor " + i + ": " + sensorCount.length + " measurements");
        console.log("Sensor " + all[i].key + ": " + all[i].value + " measurements");
        console.log("Sensor " + allsum[i].key + ": " + allsum[i].value + " total sound");
        console.log("Sensor " + allsum[i].key + ": " + allsum[i].value/all[i].value + " avg sound");
//                console.log("Sensor " + bottom[i].key + ": " + bottom[i].value + " measurements");
//                sensorDim.filterAll();
    }





    var parseHour = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
    api_data.forEach(function(d) {
        d.hour = parseHour(d.hour);
        d.hod = d.hour.getHours();
        d.month= d.hour.getMonth();
        d.dow = d.hour.getDay();
        d.date = d3.time.day(d.hour);
    });

    var feb = "2015-02-14T00:23:50"
    var february = parseHour(feb);
    console.log(feb);
    console.log(february);
    console.log(d3.time.month(february));

    var hourDim = cf.dimension(function(d) { return d.hour;});
    var monthDim  = cf.dimension(function(d) {return d.month;});
    var dowDim  = cf.dimension(function(d) {return d.dow;});
    var hodDim  = cf.dimension(function(d) {return d.hod;});
    var dateDim  = cf.dimension(function(d) {return d.date;});

    var monthTotal = monthDim.group().reduceSum(function(d) {return d.sound_avg;});

    var hodTotal = hodDim.group().reduceSum(function(d) {return d.sound_avg;});
    var dateTotal = dateDim.group().reduceSum(function(d) {return d.sound_avg;});

    var dowTotal = dowDim.group().reduceSum(function(d) {return d.sound_avg;});
    var dowCount = dowDim.group().reduceCount(function(d) {return d.sound_avg;});
    var dowAvg = dowDim.group().reduceSum(function(d) {if (d.sound_count === 0){return 0} else{return d.sound_avg / d.sound_count;} });

    var dayOfWeekNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    var monthOfYear = ["Jan", "Feb", "March", "April"];

//            count of this should be 969, not 12... right?
    var sound = hourDim.group().reduceSum(function(d) {return d.sound_avg;});
    var soundMax = hourDim.group().reduceSum(function(d) {return d.sound_max;});
    var soundMin = hourDim.group().reduceSum(function(d) {return d.sound_min;});
    var soundCount = hourDim.group().reduceSum(function(d) {return d.sound_count;});
    var minHour = hourDim.bottom(1)[0].hour;
    var maxHour = hourDim.top(1)[0].hour;
    var minMonth = monthDim.bottom(1)[0].month;
    var maxMonth = monthDim.top(1)[0].month;
    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;

    var sensorTotal = sensorDim.group().reduceSum(function(d) {return d.sound_avg;});



// todo tweak reduce functions to get avg sound / sensor values


    function reduceAddAvg(attr) {
      return function(p,v) {
        ++p.count;
        p.sum += v[attr];
        p.avg = p.sum/p.count;
        return p;
      };
    }
    function reduceRemoveAvg(attr) {
      return function(p,v) {
        --p.count;
        p.sum -= v[attr];
        p.avg = p.sum/p.count;
        return p;
      };
    }
    function reduceInitAvg() {
      return {count:0, sum:0, avg:0};
    }

    var sensorAvgGroup = sensorDim.group().reduce(reduceAddAvg('sound_avg'), reduceRemoveAvg('sound_avg'), reduceInitAvg);
    var soundAvgGroup = soundAvgDim.group().reduce(reduceAddAvg('sound_avg'), reduceRemoveAvg('sound_avg'), reduceInitAvg);
    var dowAvgGroup = hourDim.group().reduce(reduceAddAvg('sound_avg'), reduceRemoveAvg('sound_avg'), reduceInitAvg);
      console.log(soundAvgGroup);
//            var statesAvgGroup = statesAvgDimension.group().reduce(reduceAddAvg('cost'), reduceRemoveAvg('cost'), reduceInitAvg);
//


    dowChart
          .width(300).height(300)
          .margins({top: 10, left: 20, right: 10, bottom: 20})
//              .group(dowDim.group())
          .group(dowTotal)
          .dimension(dowDim)
          .label(function (d) {
              return dayOfWeekNames[d.key];
          })
          .title(function (d) {
              return d.value;
          })
          .elasticX(true)
          .xAxis().ticks(4);






    monthRingChart
        .width(300).height(300)
        .dimension(monthDim)
        .group(monthDim.group())
        .label(function (d) {
          return monthOfYear[d.key];
        })
        .innerRadius(30);



    sensorRingChart
        .width(300).height(300)
        .dimension(sensorDim)
        .group(sensorDim.group())
        .innerRadius(30);


    //#### Bar Chart
    // Create a bar chart and use the given css selector as anchor. You can also specify
    // an optional chart group for this chart to be scoped within. When a chart belongs
    // to a specific group then any interaction with such chart will only trigger redraw
    // on other charts within the same chart group.
    /* dc.barChart('#volume-month-chart') */
    hodChart
        .width(300)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(hodDim)
        .group(hodTotal)
        .elasticY(true)
        // (optional) set gap between bars manually in px, :default=2
        .gap(1)
        // (optional) set filter brush rounding
        .round(dc.round.floor)
        .alwaysUseRounding(true)
        .x(d3.scale.linear().domain([0, 23]))
        .renderHorizontalGridLines(true);

    dateBarChart
        .width(1000).height(500)
        //.margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(dateDim)
        .group(dateTotal)
        .round(dc.round.floor)
        .alwaysUseRounding(true)
        .brushOn(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.filter([d3.time.month(parseHour("2015-02-14T00:23:50")),d3.time.month(parseHour("2015-03-14T00:23:50"))])
        .legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
        .elasticY(true)
        .gap(3)
        .yAxisLabel("Decibels");


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

    dateBarChart.xUnits(function(){return 50;});

//            var tableGroup = monthDim.group().reduce(
//              function reduceAdd(p,v) {
//                p[v.status] = v.hits;
//                p["Year"]= v.Year;
//                return p;
//              },
//              function reduceRemove(p,v) {
//                p[v.status] = 0;
//                p["Year"]=v.Year;
//
//                return p;
//              },
//              function reduceInitial() { return {}; }
//              );



    datatable
        .dimension(hourDim)
        .group(function(d) {return d.hour;})
        // dynamic columns creation using an array of closures
        .columns([
            function(d) {return d.hour;},
            function(d) {return d.sound_avg;},
            function(d) {return d.sound_max;},
            function(d) {return d.sound_min;},
            function(d) {return d.sound_count;}
        ]);






<!-- todo get brush filter working -->
    hoursChart
        .width(1000).height(500)
        .dimension(hourDim)
        .brushOn(true)
//                .group(sound)
        .x(d3.time.scale().domain([minHour,maxHour]))
        .compose([
            dc.lineChart(hoursChart).group(sound, "Avg"),
            dc.lineChart(hoursChart).group(soundMax, "Max"),
            dc.lineChart(hoursChart).group(soundMin, "Min")
//                    dc.lineChart(hoursChart).group(soundCount, "Count")
        ])
        .legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
            //                    todo elastic X doesn't work, I assume due to domain set to minHour/maxHour
        .elasticX(true)
        .elasticY(true)
        .yAxisLabel("Decibels");
//                .xAxisLabel("Date");


    //#### Bubble Chart
    //Create a bubble chart and use the given css selector as anchor. You can also specify
    //an optional chart group for this chart to be scoped within. When a chart belongs
    //to a specific group then any interaction with such chart will only trigger redraw
    //on other charts within the same chart group.
    /* dc.bubbleChart('#yearly-bubble-chart', 'chartGroup') */
    //    todo figure out .colr/ key /value accessors
    //sensorBubbleChart
    //    .width(990) // (optional) define chart width, :default = 200
    //    .height(250)  // (optional) define chart height, :default = 200
    //    .transitionDuration(1500) // (optional) define chart transition duration, :default = 750
    //    .margins({top: 10, right: 50, bottom: 30, left: 40})
    //    .dimension(sensorDim)
    //    //Bubble chart expect the groups are reduced to multiple values which would then be used
    //    //to generate x, y, and radius for each key (bubble) in the group
    //    .group(sensorAvgGroup)
    //    .colors(colorbrewer.RdYlGn[9]) // (optional) define color function or array for bubbles
    //    .colorDomain([-500, 500]) //(optional) define color domain to match your data domain if you want to bind data or
    //                              //color
    //    //##### Accessors
    //    //Accessor functions are applied to each value returned by the grouping
    //    //
    //    //* `.colorAccessor` The returned value will be mapped to an internal scale to determine a fill color
    //    //* `.keyAccessor` Identifies the `X` value that will be applied against the `.x()` to identify pixel location
    //    //* `.valueAccessor` Identifies the `Y` value that will be applied agains the `.y()` to identify pixel location
    //    //* `.radiusValueAccessor` Identifies the value that will be applied agains the `.r()` determine radius size,
    //    //*     by default this maps linearly to [0,100]
    //    .colorAccessor(function (d) {
    //        return d.value.avg;
    //    })
    //    .keyAccessor(function (p) {
    //        return p.value.avg;
    //    })
    //    .valueAccessor(function (p) {
    //        return p.value.sum;
    //    })
    //    .radiusValueAccessor(function (p) {
    //        return p.value.sum;
    //    })
    //    .maxBubbleRelativeSize(0.3)
    //    .x(d3.scale.linear().domain([-2500, 2500]))
    //    .y(d3.scale.linear().domain([-100, 100]))
    //    .r(d3.scale.linear().domain([0, 4000]))
    //    //##### Elastic Scaling
    //    //`.elasticX` and `.elasticX` determine whether the chart should rescale each axis to fit data.
    //    //The `.yAxisPadding` and `.xAxisPadding` add padding to data above and below their max values in the same unit
    //    //domains as the Accessors.
    //    .elasticY(true)
    //    .elasticX(true)
    //    .yAxisPadding(100)
    //    .xAxisPadding(500)
    //    .renderHorizontalGridLines(true) // (optional) render horizontal grid lines, :default=false
    //    .renderVerticalGridLines(true) // (optional) render vertical grid lines, :default=false
    //    .xAxisLabel('Index Gain') // (optional) render an axis label below the x axis
    //    .yAxisLabel('Index Gain %') // (optional) render a vertical axis lable left of the y axis
    //    //#### Labels and  Titles
    //    //Labels are displaed on the chart for each bubble. Titles displayed on mouseover.
    //    .renderLabel(true) // (optional) whether chart should render labels, :default = true
    //    .label(function (p) {
    //        return p.key;
    //    });
        //.renderTitle(true) // (optional) whether chart should render titles, :default = false
        //.title(function (p) {
        //    return [
        //        p.key,
        //        'Index Gain: ' + numberFormat(p.value.absGain),
        //        'Index Gain in Percentage: ' + numberFormat(p.value.percentageGain) + '%',
        //        'Fluctuation / Index Ratio: ' + numberFormat(p.value.fluctuationPercentage) + '%'
        //    ].join('\n');
        //})
        //#### Customize Axis
        //Set a custom tick format. Note `.yAxis()` returns an axis object, so any additional method chaining applies
        //to the axis, not the chart.
        //.yAxis().tickFormat(function (v) {
        //    return v + '%';





    dc.renderAll();

});