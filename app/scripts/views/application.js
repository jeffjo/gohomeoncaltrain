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
            this.caltrainFixtureData = {};
            $.each(caltrainFixtureData, function (key, value) {
                this.caltrainFixtureData[key] = [];

                value.forEach(function (value, index) {
                    var departureTime = new Date(value.departureTime);
                    var arrivalTime = new Date(value.arrivalTime);
                    var currentDate = new Date();
                    this._coerceDateToCurrent(departureTime, currentDate);
                    this._coerceDateToCurrent(arrivalTime, currentDate);
                    this.caltrainFixtureData[key].push({
                        departureTime: departureTime,
                        arrivalTime: arrivalTime
                    });
                }, this);
            }.bind(this));

            this.caltrainDestinations = Object.keys(this.caltrainFixtureData).map(function(value, index){
                return {
                    value: value,
                    text: value
                }});

        },
        _coerceDateToCurrent: function (date, currentDate) {
            date.setMonth(currentDate.getMonth());
            date.setDate(currentDate.getDate() + (date.getDate() - 1));
            date.setFullYear(currentDate.getFullYear());
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
            this.selectedCaltrainDestintation = this._destinationCaltrainSelect.val();
            //TODO: Save destination preference in cookie
            this.candidateCaltrainTimes = this._calculateRemainingCaltrainTimes();
            this.render();
        },
        _calculateRemainingCaltrainTimes: function () {
            var destination = this._destinationCaltrainSelect.val();

            var times = this.caltrainFixtureData[destination];
            var candidateTimes = [];
            times.forEach(function (value, index) {
                var currentDate = new Date();

                if (value.departureTime > currentDate){
                    candidateTimes.push(value);
                }
            });

            return candidateTimes;
        }
    });

    return ApplicationView;
});
