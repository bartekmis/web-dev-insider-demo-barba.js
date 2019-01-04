'use strict';

/**
 * 
 * Universal function for animation sections while scrolling
 * Waypoints dependency needed
 * 
 */

var UTILS = UTILS || {};

function animateCascade(row) {
    let time = 400;

    row.find('.animation-childItem').each(function (index) {
        var self = this;
        setTimeout(function () {
            $(self).addClass('animated fadeIn');
        }, time);

        time = time + 200;
    });
}

UTILS.animationedSections = function animationedSections() {
    var animation = {
        runAnimation: function(section, animClassName) {
            const splittedAnimClassName = animClassName.split('-');

            setTimeout(function() {
                section.classList.remove(animClassName);
            }, 1200);
            section.classList.add('animated');
            section.classList.add(splittedAnimClassName[1]);
            section.classList.add('active');

            if (splittedAnimClassName[1] === 'cascadeItems') {
                animateCascade($(section));
            } else if ( splittedAnimClassName[1] === 'videoPlay' ) {
                if (section.tagName === 'VIDEO') {
                    section.play();
                } else if (section.querySelector('video')) {
                    section.querySelector('video').play();
                }
            }
        }
    },
    offSetSlider = '85%',
    items,
    section,
    animationClassTable = [
        'animation-fadeIn', 
        'animation-fadeInLeft', 
        'animation-fadeInRight', 
        'animation-fadeInDown', 
        'animation-fadeInUp', 
        'animation-waveHeader', 
        'animation-cascadeItems', 
        'animation-videoPlay', 
        'animation-bounceInLeft', 
        'animation-bounceInRight', 
        'animation-bounceIn'
    ],
    i;

    for (i = 0; i < animationClassTable.length; i++) {
        let dotClassName = `.${animationClassTable[i]}`,
            className = animationClassTable[i];
        
        if (document.querySelector(dotClassName)) {
            items = document.querySelectorAll(dotClassName);

            [].forEach.call(items, function(item) {
                section = new Waypoint({
                    element: item,
                    handler: function(direction) {
                        if (direction === 'down') {
                            animation.runAnimation( item, className );
                            this.destroy();
                        }
                    },
                    offset: offSetSlider
                });
            });
        }
    }
};