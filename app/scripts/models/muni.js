/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'moment'
], function ($, _, Backbone, moment) {
    'use strict';

    var MuniModel = Backbone.Model.extend({
        defaults: {
          predictions: []
        },
        urlFormat: 'http://proximobus.appspot.com/agencies/sf-muni/stops/#{stopId}/predictions/by-route/#{routeId}.json',

        sync: function(method, model, options) {
          var url = this.urlFormat.replace("#{routeId}", this.get('id'), "gi");
          var departureUrl = url.replace("#{stopId}", this.get('departureStopId'), "gi");
          var arrivalUrl = url.replace("#{stopId}", this.get('arrivalStopId'), "gi");
          options.url = departureUrl;
          var self = this;
          var params = {
            type: "GET",
            dataType: "json"
          };
          var departurePromise = Backbone.ajax(_.extend(params, options));
          options.url = arrivalUrl;
          var arrivalPromise = Backbone.ajax(_.extend(params, options));
          return $.when(departurePromise, arrivalPromise).then(function(departureData, arrivalData){
            var departures = departureData[0].items;
            var arrivals = arrivalData[0].items;

            var predictions = [];
            departures.forEach(function (departure) {
              var arrival = arrivals.filter(function (arrival) {
                return arrival.vehicle_id === departure.vehicle_id;
              })[0];
              var walkTime = self.get('minutesToDepartureStop');
              if(arrival && arrival.minutes > departure.minutes) {
                predictions.push({
                    "minutesToDepartureStop": walkTime,
                    "departureMinutes": departure.minutes,
                    "arrivalMinutes": arrival.minutes,
                    "tripTime": walkTime + arrival.minutes - departure.minutes,
                    "departureTime": moment().add(departure.seconds, 'seconds').format("HH:mm A"),
                    "arrivalTime": moment().add(arrival.seconds, 'seconds').format("HH:mm A")
                });
              }
            });
            self.set('predictions', predictions);

          });
        }
    });

    return MuniModel;
});
