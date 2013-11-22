/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'moment'
], function ($, _, Backbone, JST, moment) {
    'use strict';

    var CUTTING_IT_CLOSE_TO_GETTING_TO_MUNI = 5;

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
            this.$el.html(this.template(this.model.toJSON()));
            this.model.get('predictions').forEach(function(curPrediction, index){
                var curPredictionRow = this.$('tbody > tr').eq(index);
                var departsInCell = curPredictionRow.find('td').eq(1);

                if (curPrediction.departureMinutes < CUTTING_IT_CLOSE_TO_GETTING_TO_MUNI){
                    departsInCell.addClass('color-red');
                }
                else{
                    departsInCell.removeClass('color-red');
                }

                if (this._caltrainModel !== null){
                    if (moment(this._caltrainModel.departureTime).isBefore(curPrediction.arrivalTime)){
                        // curPredictionRow.addClass('color-grey');
                        curPredictionRow.hide();
                        departsInCell.removeClass('color-red');
                    }
                    else{
                        // curPredictionRow.removeClass('color-grey');
                        curPredictionRow.show();
                    }
                }

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
