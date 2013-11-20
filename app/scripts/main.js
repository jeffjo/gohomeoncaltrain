/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        handlebars: {
            exports: 'Handlebars'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: 'vendor/bootstrap',
        handlebars: '../bower_components/handlebars/handlebars',
        text: '../bower_components/requirejs-text/text',
        json: '../bower_components/requirejs-plugins/src/json'
    }
});

require([
    'backbone',
    'views/application',
    'handlebars'
], function (Backbone, ApplicationView, Handlebars) {
    //TODO: Bring in moment
    Handlebars.registerHelper('formatDate', function(date){
        return date.toTimeString();
    });

    Handlebars.registerHelper('lengthInMinutes', function(obj){
        return (obj.arrivalTime - obj.departureTime) / 1000 / 60
    });

    Backbone.history.start();
    var appView = new ApplicationView({el: $('#app_container')});
    appView.render();
});
