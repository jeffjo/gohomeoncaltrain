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

            this.model.forEach(function (value) {
                this.selectModel.push({
                    value: value,
                    text: value,
                    isSelected: (value === options.selectedDestination)
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
            var selectedValue = this.$('#destination_caltrain_select').val();
            //TODO: try to optimize
            this.selectModel.forEach(function (value) {
                value.isSelected = (value.value === selectedValue);
            });
            this.trigger('destinationSelected', selectedValue);
        }
    });

    return SelectCaltrainView;
});
