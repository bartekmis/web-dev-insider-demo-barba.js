'use strict';

/**
 * 
 * Universal function for popups
 * MagnificPopup and jQuery dependency needed
 * 
 */

var UTILS = UTILS || {};

UTILS.magnific = function magnific() {
    $('a.js-popup, a.popup, a.js-video').on('click', function() {
        var href = $(this).attr('href'),
            type = href.substring(href.length-4, href.length),
            title = $(this).attr('title');

            if (type === '.jpg' || type === '.gif' || type === '.png' || type === '.jpeg') {
                type = 'image';
            } else {
                type = 'iframe';
            }

            $.magnificPopup.open({
                items: {
                    src: href
                },
                type: type,

                image: {
                    markup: '<div class="mfp-figure">'+
                            '<div class="mfp-img"></div>'+
                            '<div class="mfp-bottom-bar">'+
                                '<div class="mfp-title"></div>'+
                                '<div class="mfp-counter"></div>'+
                                '<p class="mfp-close"></p>'+
                            '</div>'+
                            '<p class="mfp-close"></p>'+
                            '</div>',

                    cursor: 'mfp-zoom-out-cur',
                    titleSrc: title,
                    verticalFit: true, // Fits image in area vertically
                    tError: '<a href="%url%">The image</a> could not be loaded.' // Error message
                },

                iframe: {
                    patterns: {
                        youtube: {
                            index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).
                            id: 'v=', // String that splits URL in a two parts, second part should be %id%
                            src: '//www.youtube.com/embed/%id%?autoplay=1&rel=0' // URL that will be set as a source for iframe.
                        }
                    }
                },
                //closeMarkup: '<a class="mfp-close btn btn--gold">CLOSE</a>',

                mainClass: 'mfp-fade',
                titleSrc: title,
                gallery: {
                    enabled: true,
                    navigateByImgClick: true
                }
            });

        return false;
    });
};

UTILS.ajaxPopup = function ajaxPopup() {
    $('.js-ajax-popup').on('click', function (e) {
        var self = this;

        $.magnificPopup.open({
            type: 'ajax',
            items: {
                src: self.getAttribute('data-href')
            }
        }, 0);

        return false;
    });
};

UTILS.openPopupOnClick = function openPopupOnClick() {
    if ( document.querySelector('.js-open-popup') ) {
        var popupButtons = document.querySelectorAll('.js-open-popup');

        [].forEach.call(popupButtons, function(popupButton) {
            popupButton.addEventListener("click", function( event ) {
                event.preventDefault();

                if (event.currentTarget.href) {
                    window.open(
                        event.currentTarget.href,
                        '_blank',
                        'toolbar=no, scrollbars=yes, resizable=yes, width=500, height=400'
                    );
                }

            }, false);
        });
    }
};
