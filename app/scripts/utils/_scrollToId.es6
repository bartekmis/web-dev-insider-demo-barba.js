'use strict';

/**
 * 
 * Scroll To ID 
 * jquery needed
 * 
 */

var UTILS = UTILS || {};

UTILS.scrollToID = function scrollToID(id, context = 'html,body', offSet = 80) {
    let x = UTILS.screenSize().x;
    
    if (x < 768) {
        offSet = 60;
    }

    if ($(id).length) {
        var targetOffset = $(id).offset().top - offSet;
        $(context).animate({scrollTop:targetOffset}, 1000);
    }
};

UTILS.hashAnchorClick = function hashAnchorClick() {
    $('a[href^="#"]:not(.js-scroll-to)').on('click', function (e) {
        var target = this.hash,
            hashValue = target.substr(target.indexOf("#"));

        if (hashValue === '#contact') {
            return true;
        }

        if (hashValue.length) {
            UTILS.scrollToID( hashValue );
        }

        return false;
    });

    return false;
};
