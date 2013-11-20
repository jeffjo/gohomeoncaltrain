/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var SelectCaltrainView = Backbone.View.extend({
        initialize: function(){
            this.selectModel = [];

            this.model.forEach(function (value, index) {
                this.selectModel.push({
                    value: value,
                    text: value,
                    isSelected: false
                });
            }, this);
        },
        template: JST['app/scripts/templates/select_caltrain.hbs'],
        render: function () {
            this.$el.html(this.template(this.selectModel));
            return this;
        },
        events: {
            "change #destination_caltrain_select": "caltrainDestinationDidChange"
        },
        caltrainDestinationDidChange: function(ev){
            var selectedValue = this.$("#destination_caltrain_select").val();
            //TODO: try to optimize
            this.selectModel.forEach(function (value) {
                value.isSelected = (value.value === selectedValue);
            });
            this.trigger('destinationSelected', selectedValue);
        }
    });

    return SelectCaltrainView;
});
