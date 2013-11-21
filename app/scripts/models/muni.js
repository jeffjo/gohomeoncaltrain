/*global define*/

define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    'use strict';

    var MuniModel = Backbone.Model.extend({
        defaults: {
          departurePredictions: [],
          arrivalPredictions: []
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
          var departurePromise = Backbone.ajax(_.extend(params, options)).then(function(data) {
            self.set('departurePredictions', data.items);
          });
          options.url = arrivalUrl;
          var arrivalPromise = Backbone.ajax(_.extend(params, options)).then(function(data) {
            self.set('arrivalPredictions', data.items);
          });
          return $.when(departurePromise, arrivalPromise);
        }
    });

    return MuniModel;
});
