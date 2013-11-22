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
        }
    });

    return MuniSortedListView;
});
