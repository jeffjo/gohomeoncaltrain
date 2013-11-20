/*global define*/

define([
],function() {
    'use strict';

    function MuniRoute(attrs){
        if ((typeof attrs !== 'undefined') && (attrs !== null)){
            this.id = attrs.id;
            this.timeToDepartureStop = attrs.timeToDepartureStop;
            this.departureStopId = attrs.departureStopId;
            this.departureStopName = attrs.departureStopName;
            this.arrivalStopId = attrs.arrivalStopId;
        }
        this.predictions = [];
    }

    return MuniRoute;
});
