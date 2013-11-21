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
        json: '../bower_components/requirejs-plugins/src/json',
        moment: '../bower_components/momentjs/moment'
    }
});

require([
    'backbone',
    'views/application',
    'handlebars',
    'moment',
    'templates'
], function (Backbone, ApplicationView, Handlebars, moment, JST) {

    //TODO: Put handlebars helpers in seperate file
    Handlebars.registerHelper('formatDate', function(date, format){
        return moment(date).format(format);
    });

    Handlebars.registerHelper('timeDiffInMinutes', function(departureTime, arrivalTime){
        return moment(arrivalTime).diff(departureTime, 'minutes');
    });
    Handlebars.registerPartial('twitter', JST['app/scripts/templates/twitter.hbs']);

    Backbone.history.start();
    var appView = new ApplicationView({el: $('#app_container')});
    appView.render();
});
