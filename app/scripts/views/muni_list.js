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
        render: function(){
            this.$el.html(this.template(this.collection.models));
            this.collection.forEach(function(model){
                this.$el.append((new MuniRowView({model: model})).el);
            }, this);
            return this;
        }
    });

    return MuniListView;
});
