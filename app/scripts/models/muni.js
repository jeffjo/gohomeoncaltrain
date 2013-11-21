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
          var url = this.urlFormat.replace("#{stopId}", this.get('arrivalStopId'), "gi");
          options.url = url.replace("#{routeId}", this.get('id'), "gi");
          return Backbone.sync(method, model, options);
        }
    });

    return MuniModel;
});
