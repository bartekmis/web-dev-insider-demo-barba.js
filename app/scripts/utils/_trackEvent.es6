'use strict';

/**
 * 
 * Event tracking
 * Waypoints dependency needed
 * 
 */

var UTILS = UTILS || {};

UTILS.trackEvent = function trackEvent() {
    $('a[data-type="trackEvent"]').on('click', function() {
        let ga = window.ga || null;

        if (!ga) {
            return true;
        }

        let link = $(this),
            data = {
                'hitType': 'event',
                'eventCategory': link.data('category') ? link.data('category') : '',
                'eventAction': link.data('action') ? link.data('action') : '',
                'eventLabel': link.data('label') ? link.data('label') : ''
            };

        if (link.data('value')) {
            data.eventValue = link.data('value');
        }

        if (
            link.attr('target') !== '_blank' && !link.hasClass('js-video')
        ) {
            data.hitCallback = function() {
                window.location = link.attr('href');
            };
        }

        if (data.eventCategory || data.eventAction || data.eventLabel) {
            ga('send', data);
        }

        return data.hitCallback ? false : true;
    });
};
