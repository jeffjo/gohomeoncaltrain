/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'json!models/caltrain_fixture.json'
], function ($, _, Backbone, JST, caltrainFixtureData) {
    'use strict';

    var ApplicationView = Backbone.View.extend({
        template: JST['app/scripts/templates/application.hbs'],
        render: function () {
            this.$el.html(this.template());
            this._destinationCaltrainSelect = this.$('#destination_caltrain_select');
            this._populateCaltrainDestinations();
            //TODO: Load destination preference from cookie
            return this;
        },
        events: {
          "change #destination_caltrain_select": "caltrainDestinationDidChange"
        },
        caltrainDestinationDidChange: function(ev){
            console.log("changed to: " + this._destinationCaltrainSelect.val());
            //TODO: Save destination preference in cookie
        },
        _populateCaltrainDestinations: function(){
            var options = []
            $.each(caltrainFixtureData, function (key, value) {
                options.push("<option value='" + key + "'>" + key + "</option>");
            });
            this._destinationCaltrainSelect.html(options.join('\n'));
        }
    });

    return ApplicationView;
});
