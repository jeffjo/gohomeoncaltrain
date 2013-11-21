/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'json!models/json/caltrain_fixture.json',
    'views/select_caltrain',
    'views/caltrain_list',
    'collections/muni',
    'views/muni_list'
], function ($, _, Backbone, JST, caltrainFixtureData, SelectCaltrainView, CaltrainListView, MuniCollection, MuniListView) {
    'use strict';
    var SELECTED_DESTINATION_LOCAL_STORAGE_KEY = 'selectedDestination';

    var ApplicationView = Backbone.View.extend({
        template: JST['app/scripts/templates/application.hbs'],
        initialize: function () {
            //TODO: functionize
            this.caltrainFixtureData = {};
            $.each(caltrainFixtureData, function (key, value) {
                this.caltrainFixtureData[key] = [];

                value.forEach(function (value) {
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
            var savedSelectedDestination = localStorage.getItem(SELECTED_DESTINATION_LOCAL_STORAGE_KEY);
            this._selectCaltrainView = new SelectCaltrainView({
                model: Object.keys(this.caltrainFixtureData),
                el: this.$('#select_caltrain_view'),
                selectedDestination: savedSelectedDestination
            });
            this._selectCaltrainView.render();

            this._caltrainListView = new CaltrainListView({
                el: this.$('#caltrain_list_view')
            });

            if (savedSelectedDestination !== null){
                this._destinationSelected(savedSelectedDestination);
            }

            this._muniListView = new MuniListView({
                collection: new MuniCollection(),
                el: this.$('#muni_list_view')
            });

            this._caltrainListView.on('click', function (/*caltrainModel*/) {
                //TODO: Update muni list view here
            }, this);

            this._selectCaltrainView.on('destinationSelected', this._destinationSelected, this);

            return this;
        },
        _destinationSelected: function(destination){
            this.candidateCaltrainTimes = this._calculateRemainingCaltrainTimes(destination);

            this._caltrainListView.updateModel(this.candidateCaltrainTimes);
            this._caltrainListView.render();

            localStorage.setItem(SELECTED_DESTINATION_LOCAL_STORAGE_KEY, destination);

        },
        _calculateRemainingCaltrainTimes: function (destination) {
            var times = this.caltrainFixtureData[destination];
            var candidateTimes = [];
            times.forEach(function (value) {
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
