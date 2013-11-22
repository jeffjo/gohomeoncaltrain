/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var MuniSortedListView = Backbone.View.extend({
        template: JST['app/scripts/templates/muni_sorted_list.hbs'],
        initialize: function() {
            _.bindAll(this, 'render');
            this.collection.on('change', this.render);
        },
        render: function() {
            this.predictions = this.getPredictions();
            this.$el.html(this.template(this));
            return this;
        },
        getPredictions: function() {
          var predictions = [];
          this.collection.models.forEach(function(model){
            model.get('predictions').forEach(function(prediction){
                if(!this.departureTime || this.departureTime > prediction.arrivalTime) {
                    predictions.push(prediction);
                }
            }, this);
          }, this);
          if(this.departureTime) {
              predictions = predictions.sort(function(a,b){
                  var tripTimeA = (this.departureTime - a.arrivalTime)/60000 + a.tripMinutes;
                  var tripTimeB = (this.departureTime - b.arrivalTime)/60000 + b.tripMinutes;
                  return tripTimeA - tripTimeB;
              }.bind(this));
          }
          return predictions;
        },
        highlightTimes: function(caltrainModel) {
            // Find and highlight min trip time
            var selectedMuniIndex = -1;
            var minTime = Number.MAX_VALUE;
            this.departureTime = caltrainModel.departureTime;
            this.render();
        }
    });
    return MuniSortedListView;
});
