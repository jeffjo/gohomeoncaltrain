/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/muni_row'
], function ($, _, Backbone, JST, MuniRowView) {
    'use strict';

    var MuniListView = Backbone.View.extend({
        template: JST['app/scripts/templates/muni_list.hbs'],
        initialize: function () {
            this.collection.bind('reset', _.bind(this.render, this));
            this.collection.fetch({reset: true});
        },
        _views: [],
        render: function(){
            this.$el.html(this.template(this));
            this.collection.forEach(function(model){
                var view = new MuniRowView({model: model});
                this.$el.append(view.el);
                this._views.push(view);
            }, this);
            return this;
        },
        highlightTimes: function(caltrainModel) {
            // Find and highlight min trip time
            var selectedMuniView = null, selectedMuniIndex = -1;
            var minTime = Number.MAX_VALUE;
            var departureTime = caltrainModel.departureTime;
            this._views.forEach(function(curRowView){
                curRowView.$('tbody > tr').removeClass('is-optimal');
                curRowView.model.get('predictions').forEach(function(prediction, index){
                  if(departureTime > prediction.arrivalTime) {
                    var tripTime = (departureTime - prediction.arrivalTime)/60000 + prediction.tripMinutes;
                    if(tripTime < minTime) {
                      minTime = tripTime;
                      selectedMuniView = curRowView;
                      selectedMuniIndex = index;
                    }
                  }
                });
            });
            if(selectedMuniView) {
                selectedMuniView.$('tbody > tr').eq(selectedMuniIndex).addClass('is-optimal');
                this.$('.no-routes-available').hide();
            }
            else {
                this.$('.no-routes-available').show();
            }
        }
    });

    return MuniListView;
});
