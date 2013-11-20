/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'json!models/caltrain_fixture.json',
    'views/select_caltrain',
    'views/caltrain_list'
], function ($, _, Backbone, JST, caltrainFixtureData, SelectCaltrainView, CaltrainListView) {
    'use strict';


    var ApplicationView = Backbone.View.extend({
        template: JST['app/scripts/templates/application.hbs'],
        initialize: function () {
            //TODO: functionize
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
        },
        _coerceDateToCurrent: function (date, currentDate) {
            date.setMonth(currentDate.getMonth());
            date.setDate(currentDate.getDate() + (date.getDate() - 1));
            date.setFullYear(currentDate.getFullYear());
        },
        render: function () {
            this.$el.html(this.template(this));

            //TODO: Load destination preference from cookie
            this._selectCaltrainView = new SelectCaltrainView({
                model: Object.keys(this.caltrainFixtureData),
                el: this.$('#select_caltrain_view')
            });
            this._selectCaltrainView.render();

            this._caltrainListView = new CaltrainListView({
                el: this.$('#caltrain_list_view')
            });

            this._selectCaltrainView.on('destinationSelected', function(destination){
                //TODO: Save destination preference in cookie
                this.candidateCaltrainTimes = this._calculateRemainingCaltrainTimes(destination);

                this._caltrainListView.updateModel(this.candidateCaltrainTimes);
                this._caltrainListView.render();
            }, this);

            return this;
        },
        _calculateRemainingCaltrainTimes: function (destination) {
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
