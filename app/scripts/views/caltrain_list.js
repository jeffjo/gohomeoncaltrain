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
        tagName: 'ul',
        template: JST['app/scripts/templates/caltrain_list.hbs'],
        _views: [],
        render: function(){
            this.$el.html(this.template(this.model));
            this.model.forEach(function(value) {
                var view = new CaltrainRowView({model: value});
                this.$el.append(view.render().el);
                view.on('click', function(caltrainModel) {
                    this.trigger('click', caltrainModel);
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
