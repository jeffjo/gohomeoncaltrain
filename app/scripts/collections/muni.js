/*global define*/

define([
    'underscore',
    'backbone',
    'models/muni'
], function (_, Backbone, MuniModel) {
    'use strict';

    var MuniCollection = Backbone.Collection.extend({
        model: MuniModel,
        url: 'scripts/models/json/muni_fixture.json'
    });

    return MuniCollection;
});
