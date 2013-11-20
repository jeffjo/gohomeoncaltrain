(function () {
    var csv = require('csv'),
        unzip = require('unzip'),
        request = require('request'),
        moment = require('moment'),
        fs = require('fs');

    //Unzip GTFS zip file
    //Read calendar = calendar.txt
    //  Get list of service_ids for latest set of end dates
    //Read trips = trips.txt
    //  Get list of trip_ids for relevant service_ids that are also southbound (direction_id === 1)
    //Read stopTimes = stop_times.txt
    //  for each trip_id
    //   record stop data - departure (time on stop_sequence === 1) + arrival time

    //TODO: Make this an optional parameter?
    var DATA_URL = 'http://www.gtfs-data-exchange.com/agency/caltrain/latest.zip';
    //TODO: Make this a parameter??
    var outputFile = "../app/scripts/models/caltrain_fixture.json";
    var calendar = [],
        trips = [],
        stopTimes = [],
        serviceIds = {},
        tripIds = {},
        stops = {};

    request(DATA_URL)
        .pipe(unzip.Parse())
        .on('entry', function(entry){
            console.log("Processing file: " + entry.path);
            if (entry.path === 'calendar.txt') {
                csvToArray(entry, calendar);
            }
            else if (entry.path === 'trips.txt') {
                csvToArray(entry, trips);
            }
            else if (entry.path === 'stop_times.txt'){
                csvToArray(entry, stopTimes);
            }
            else{
              entry.autodrain();
            }
        })
        .on('close', function(){
            var maxDate, maxDateString;
            calendar.forEach(function(element) {
                var date = moment(element.end_date, "YYYYMMDD");
                if (!maxDate || date > maxDate) {
                    maxDate = date;
                    maxDateString = element.end_date;
                }
            });


            // services with the latest end dates
            calendar.forEach(function(element){
                if (element.end_date === maxDateString){
                    if (element.service_id.substring(0,2) === "WD"){
                      serviceIds[element.service_id] = true;
                    }
                }
            });

            trips.forEach(function(element){
                if(serviceIds[element.service_id] && (element.direction_id === "1"))
                    tripIds[element.trip_id] = true;
            });

            stopTimes.forEach(function(element, index, array){
                if (tripIds[element.trip_id]){
                    if (!stops[element.stop_id]){
                        stops[element.stop_id] = [];
                    }
                    departureTime = parseTime(array[index - (element.stop_sequence - 1)].departure_time);
                    stops[element.stop_id].push({
                        arrivalTime: parseTime(element.arrival_time),
                        departureTime: departureTime
                    });
                }
            });

            for (var key in stops){
              if (stops.hasOwnProperty(key)){
                stops[key] = stops[key].sort(function(a, b){
                    return a.departureTime - b.departureTime;
                });
              }
            }

            fs.writeFileSync(outputFile, JSON.stringify(stops, null, 4));

            console.log("Done writing data");
        })
        .on('error', function(err){
            console.log("Error reading file: " + err);
        });

    function parseTime(timeString) {
        time = moment("01/01/2013 " + timeString, "MM/DD/YYYY HH:mm:ss");
        if(!time.isValid()) {
            timeTokens = timeString.split(':');
            hour = parseInt(timeTokens[0], 10) % 24;
            time = moment("01/02/2013 0" + hour + timeString.substring(2), "MM/DD/YYYY HH:mm:ss");
        }
        return time;
    }

    function csvToArray(entry, array){
        //TODO: Transform is not really the right things to do here. Figure out
        //        how we can use .to.array()
        entry.pipe(csv().from.options({columns: true})
            .transform(function(row) {
                array.push(row);
            }));
    }
}());
