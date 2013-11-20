/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var MuniModel = Backbone.Model.extend({
        defaults: {
          departurePredictions: [],
          arrivalPredictions: []
        },
        urlFormat: 'http://proximobus.appspot.com/agencies/sf-muni/stops/#{stopId}/predictions/by-route/#{routeId}.json',

        sync: function(method, model, options) {
          debugger;
          var url = this.urlFormat.replace("#{stopId}", this.arrivalStopId, "gi");
          url = url.replace("#{routeId}", this.id, "gi");
          console.log("arrival id " + this.arrivalStopId + " dep id " + this.departureStopId + " route id " + this.id);
          console.log(url);
        }
    });

    return MuniModel;
});
