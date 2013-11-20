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
        initialize: function () {
            this.caltrainFixtureData = caltrainFixtureData;
        },
        render: function () {
            this.$el.html(this.template(this));
            this._destinationCaltrainSelect = this.$('#destination_caltrain_select');
            //TODO: Load destination preference from cookie
            return this;
        },
        events: {
          "change #destination_caltrain_select": "caltrainDestinationDidChange"
        },
        caltrainDestinationDidChange: function(ev){
            console.log("changed to: " + this._destinationCaltrainSelect.val());
            //TODO: Save destination preference in cookie
            this.candidateCaltrainTimes = this._calculateRemainingCaltrainTimes();
        },
        _calculateRemainingCaltrainTimes: function () {
            var destination = this._destinationCaltrainSelect.val();

            var times = this.caltrainFixtureData[destination];
            var candidateTimes = [];
            times.forEach(function (value, index) {
                var departureTime = new Date(value.departureTime);
                var currentDate = new Date();
                currentDate.setMonth(0);
                currentDate.setDate(1);
                currentDate.setYear(2013);

                if (departureTime > currentDate){
                    candidateTimes.push(value);
                }
            });

            console.log("chose " + candidateTimes.length + " times");
            return candidateTimes;
        }
    });

    return ApplicationView;
});
