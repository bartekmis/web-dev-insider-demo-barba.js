'use strict';

/**
 * 
 * Infinite Scroll - jquery needed
 * 
 */

var UTILS = UTILS || {};

UTILS.infiniteScroll = function infiniteScroll(callback) {
    let infinite,
        infiniteWrapper = '#js-infinity-wrapper';

    if ($(infiniteWrapper).length) {

        infinite = new Waypoint.Infinite({
            element: $(infiniteWrapper)[0],
            onAfterPageLoad: function() {
                if (callback) {
                    callback();
                }
            }
        });
    }
};
