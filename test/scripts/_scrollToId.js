'use strict';

/**
               * 
               * Scroll To ID 
               * jquery needed
               * 
               */

var UTILS = UTILS || {};

UTILS.scrollToID = function scrollToID(id) {var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'html,body';
    var path = window.location.pathname;
    var offSet = 80;
    var x = UTILS._screenSize().x;

    if (x < 768) {
        offSet = 60;
    }
    var targetOffset = $(id).offset().top - offSet;

    $(context).animate({ scrollTop: targetOffset }, 1000);
};

UTILS.hashAnchorClick = function hashAnchorClick() {
    $('a[href*="#"]:not(.js-scroll-to)').on('click', function (e) {

        var target = this.hash,
        hashValue = target.substr(target.indexOf("#"));

        if (hashValue.length) {
            UTILS.scrollToID(hashValue);
        }

        return false;
    });

    return false;
};