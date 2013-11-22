/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'moment'
], function ($, _, Backbone, JST, moment) {
    'use strict';

    var CUTTING_IT_CLOSE_TO_GETTING_TO_MUNI = 10;

    var MuniRowView = Backbone.View.extend({
        template: JST['app/scripts/templates/muni_row.hbs'],
        className: 'muni-row',
        _caltrainModel: null,
        initialize: function() {
            this.model.bind('change', _.bind(this.render, this));
            this.model.fetch();
            setInterval(function(){
                //TODO: Consider not reloading DOM elements every time and just updating the text contents and styles after refresh
                this.model.fetch();
            }.bind(this), 30000);
        },
        render: function() {
            this.model.set('filteredPredictions', this.model.get('predictions').filter(function(curPrediction){
                return ((this._caltrainModel === null) || moment(this._caltrainModel.departureTime).isAfter(curPrediction.arrivalTime));
            }, this));

            this.$el.html(this.template(this.model.toJSON()));
            this.model.get('filteredPredictions').forEach(function(curPrediction){
                curPrediction.cuttingClose = curPrediction.departureMinutes < CUTTING_IT_CLOSE_TO_GETTING_TO_MUNI;
            }, this);
            return this;
        },
        setCaltrainModel: function(caltrainModel){
            this._caltrainModel = caltrainModel;
            this.render();
        }
    });

    return MuniRowView;
});
