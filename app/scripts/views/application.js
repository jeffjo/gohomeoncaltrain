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
    'views/muni_list',
    'views/muni_sorted_list'
], function ($, _, Backbone, JST, caltrainFixtureData, SelectCaltrainView, CaltrainListView, MuniCollection, MuniListView, MuniSortedListView) {
    'use strict';
    var SELECTED_DESTINATION_LOCAL_STORAGE_KEY = 'selectedDestination';
    var MUNI_DETAIL_VIEW_SELECTED_KEY = 'muniDetailViewSelected';

    var ApplicationView = Backbone.View.extend({
        template: JST['app/scripts/templates/application.hbs'],
        events: {
            'change #toggle_view_checkbox': 'toggleViewWasChanged',
            'change #toggle_caltrain_list': 'toggleCaltrainList'
        },
        toggleCaltrainList: function(ev){
            if (ev.target.checked){
                $('#caltrain_list_view').css('height', '100%');
            }
            else{
                $('#caltrain_list_view').css('height', '110px');
            }
        },
        toggleViewWasChanged: function(ev){
            if (ev.target.checked){
                $('#muni_sorted_list_view').hide();
                $('#muni_list_view').show();
            }
            else {
                $('#muni_sorted_list_view').show();
                $('#muni_list_view').hide();
            }

            localStorage.setItem(MUNI_DETAIL_VIEW_SELECTED_KEY, ev.target.checked);
        },
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

            this.muniCollection = new MuniCollection();

            this._muniListView = new MuniListView({
                collection: this.muniCollection,
                el: this.$('#muni_list_view')
            });

            this._muniSortedListView = new MuniSortedListView({
                collection: this.muniCollection,
                el: this.$('#muni_sorted_list_view')
            });

            this._caltrainListView.on('click', function (caltrainModel) {
                this._muniListView.setCaltrainModel(caltrainModel);
                this._muniSortedListView.highlightTimes(caltrainModel);
            }, this);

            this._selectCaltrainView.on('destinationSelected', this._destinationSelected, this);

            if (localStorage.getItem(MUNI_DETAIL_VIEW_SELECTED_KEY) === 'true'){
                this.$('#toggle_view_checkbox').attr('checked', 'checked').trigger('change');
            }
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
