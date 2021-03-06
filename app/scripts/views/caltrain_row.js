/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var CaltrainRowView = Backbone.View.extend({
        className: 'caltrain-row',
        template: JST['app/scripts/templates/caltrain_row.hbs'],
        render: function () {
            this.$el.html(this.template(this.model));
            return this;
        },
        events: {
            'click': 'clicked'
        },
        clicked: function(){
            this.trigger('click', this);
        }

    });

    return CaltrainRowView;
});
