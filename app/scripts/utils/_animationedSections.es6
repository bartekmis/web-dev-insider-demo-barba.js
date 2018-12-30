'use strict';

/**
 * 
 * Universal function for animation sections while scrolling
 * Waypoints dependency needed
 * 
 */
// jshint ignore: start

var UTILS = UTILS || {};

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
            }
        },
        offSetSlider = '85%',
        items,
        section,
        animationClassTable = ['animation-fadeInUp'],
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