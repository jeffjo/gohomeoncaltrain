/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/caltrain_row'
], function ($, _, Backbone, JST, CaltrainRowView) {
    'use strict';

    var CaltrainListView = Backbone.View.extend({
        template: JST['app/scripts/templates/caltrain_list.hbs'],
        _views: [],
        render: function(){
            this.$el.html(this.template(this.model));
            this.model.forEach(function(value) {
                var view = new CaltrainRowView({model: value});
                this.$el.append(view.render().el);
                view.on('click', function(rowView) {
                    this.$('.caltrain-row').removeClass('is-active');
                    rowView.$el.addClass('is-active');
                    this.trigger('click', rowView.model);
                }, this);
                this._views.push(view);

            }, this);
            return this;
        },
        updateModel: function(newModel){
            //TODO: Is this all we need to avoid memory leaks?
            this._views.forEach(function(curView) {
                curView.remove();
                curView.off('click');
            });
            this.model = newModel;
        }
    });

    return CaltrainListView;
});
