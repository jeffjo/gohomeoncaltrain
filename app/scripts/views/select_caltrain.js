/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var SelectCaltrainView = Backbone.View.extend({
        initialize: function(options){
            this.selectModel = [];
            this.selectedDestination = options.selectedDestination;
            this.model.forEach(function (value) {
                this.selectModel.push({
                    value: value,
                    text: value,
                    isSelected: (value === this.selectedDestination)
                });
            }, this);
        },
        template: JST['app/scripts/templates/select_caltrain.hbs'],
        render: function () {
            this.$el.html(this.template(this.selectModel));
            return this;
        },
        events: {
            'change #destination_caltrain_select': 'caltrainDestinationDidChange'
        },
        caltrainDestinationDidChange: function(){
            this.selectedDestination = this.$('#destination_caltrain_select').val();
            //TODO: try to optimize
            this.selectModel.forEach(function (value) {
                value.isSelected = (value.value === this.selectedDestination);
            }, this);
            this.trigger('destinationSelected', this.selectedDestination);
        }
    });

    return SelectCaltrainView;
});
