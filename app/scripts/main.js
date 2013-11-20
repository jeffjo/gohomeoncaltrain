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

    Handlebars.registerHelper('selectOptions', function(options, valueKey, textKey, selectedValue) {
        console.log(selectedValue);
        var out = [];
        for (var x = 0; x < options.length; x++){
            var optionStr = '<option value="' + options[x][valueKey] + '"';
            if (options[x][valueKey] === selectedValue){
                optionStr += ' selected="selected" ';
            }
            optionStr += '>';
            optionStr += options[x][textKey];
            optionStr += '</option>';
            out.push(optionStr);
        }
        return out.join('\n');
    });

    Backbone.history.start();
    var appView = new ApplicationView({el: $('#app_container')});
    appView.render();
});
