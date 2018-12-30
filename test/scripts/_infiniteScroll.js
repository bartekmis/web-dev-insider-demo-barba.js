'use strict';

/**
               * 
               * Infinite Scroll - jquery needed
               * 
               */

var UTILS = UTILS || {};

UTILS.infiniteScroll = function infiniteScroll() {
    var infinite = void 0,
    infiniteWrapper = '#js-infinity-wrapper';

    if ($(infiniteWrapper).length) {

        infinite = new Waypoint.Infinite({
            element: $(infiniteWrapper)[0] });



    }
};