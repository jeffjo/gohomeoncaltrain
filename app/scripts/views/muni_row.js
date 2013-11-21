/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var MuniRowView = Backbone.View.extend({
        template: JST['app/scripts/templates/muni_row.hbs'],
        className: 'muni-row',
        initialize: function() {
            this.model.bind('change', _.bind(this.render, this));
            this.model.fetch();
            setInterval(function(){
                this.model.fetch();
            }.bind(this), 30000);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return MuniRowView;
});
