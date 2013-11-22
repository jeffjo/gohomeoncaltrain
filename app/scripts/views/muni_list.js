/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/muni_row'
], function ($, _, Backbone, JST, MuniRowView) {
    'use strict';

    var MuniListView = Backbone.View.extend({
        template: JST['app/scripts/templates/muni_list.hbs'],
        initialize: function () {
            this.collection.bind('reset', _.bind(this.render, this));
            this.collection.fetch({reset: true});
        },
        _views: [],
        _caltrainModel: null,
        render: function(){
            this.$el.html(this.template(this));
            this.collection.forEach(function(model){
                var view = new MuniRowView({model: model});
                this.$el.append(view.el);
                this._views.push(view);
            }, this);
            return this;
        },
        setCaltrainModel: function(caltrainModel) {
            this._caltrainModel = caltrainModel;

            this._views.forEach(function(curView){
                curView.setCaltrainModel(caltrainModel);
            });
        }
    });

    return MuniListView;
});
