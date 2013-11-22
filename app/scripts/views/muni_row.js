/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'moment'
], function ($, _, Backbone, JST, moment) {
    'use strict';

    var MuniRowView = Backbone.View.extend({
        template: JST['app/scripts/templates/muni_row.hbs'],
        className: 'muni-row',
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
            // //TODO: Explore highlighting departure times that are less than walk times
            // this.model.get('predictions').forEach(function(curPrediction, index){
            //     var departsInCell = this.$('tbody > tr').get(index).find('td').get(3);
            //     if (curPrediction.departureMinutes < this.model.get('minutesToDepartureStop')){
            //         departsInCell.addClass('color-red');
            //     }
            //     else{
            //         departsInCell.removeClass('color-red');
            //     }
            // }, this);
            return this;
        }
        // highlightTimes: function(caltrainModel){
        //     this.$('muni-prediction-table > tr').removeClass('muni-prediction-unreachable');

        //     this.model.get('predictions').forEach(function(curPrediction, index){
        //         if (moment(caltrainModel.departureTime).diff(moment(curPrediction.arrivalMinutes, 'hh:mm A')) < 0){
        //             this.$('.muni-prediction-table > tbody > tr:nth-of-type(' + (index + 1) + ')').addClass('muni-prediction-unreachable');
        //         }
        //     }, this);
        // }
    });

    return MuniRowView;
});
