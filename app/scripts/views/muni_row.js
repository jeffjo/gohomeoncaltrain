/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var MuniRowView = Backbone.View.extend({
        tagName: 'li',
        template: JST['app/scripts/templates/muni_row.hbs'],
        initialize: function() {
            this.model.bind("change", _.bind(this.render, this));
            this.model.fetch();
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return MuniRowView;
});
