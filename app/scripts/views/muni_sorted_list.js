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
            this.$el.html(this.template(this.getPredictions()));
            return this;
        },
        getPredictions: function() {
          var predictions = [];
          this.collection.models.forEach(function(model){
            model.get('predictions').forEach(function(prediction){
              predictions.push(prediction);
            });
          });
          return predictions;
        },
        highlightTimes: function(caltrainModel) {
            // Find and highlight min trip time
            var selectedMuniIndex = -1;
            var minTime = Number.MAX_VALUE;
            var departureTime = caltrainModel.departureTime;
            this.getPredictions().forEach(function(prediction, index){
                this.$('tbody > tr').removeClass('is-optimal');
                if(departureTime > prediction.arrivalTime) {
                    var tripTime = (departureTime - prediction.arrivalTime)/60000 + prediction.tripMinutes;
                    if(tripTime < minTime) {
                        minTime = tripTime;
                        selectedMuniIndex = index;
                    }
                }
            }, this);
            if(selectedMuniIndex !== -1) {
                this.$('tbody > tr').eq(selectedMuniIndex).addClass('is-optimal');
                this.$('.no-routes-available').hide();
            }
            else {
                this.$('.no-routes-available').show();
            }
        }
    });
    return MuniSortedListView;
});
