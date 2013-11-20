/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var CaltrainListView = Backbone.View.extend({
        template: JST['app/scripts/templates/caltrain_list.hbs'],
        render: function(){
            this.$el.html(this.template(this.model));
            return this;
        },
        updateModel: function(newModel){
            //TODO: Unwiring??
            this.model = newModel;
        }
    });

    return CaltrainListView;
});
