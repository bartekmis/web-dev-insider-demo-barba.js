'use strict';

var WDI = WDI || {};
var UTILS = UTILS || {};
let googleMapLoaded = false;
const googleMapsApiKey = 'AIzaSyDRW_jEr6N_0BCjboAATfun4sZVdvmcfVo';

WDI.utils = UTILS || {};

WDI.utils.position = $(window).scrollTop();
WDI.offsetY = window.pageYOffset;

WDI.navigationVisibility = function navbarPosition() {
    let scroll;
    let topNavBar = document.querySelector('.l-navbar');

    if (!document.querySelector('body').classList.contains('stop-scrolling') ) {
        scroll = window.scrollY || window.pageYOffset  || document.documentElement.scrollTop;

        if (topNavBar) {
            if (scroll > WDI.utils.position && WDI.utils.position > -1) {
                topNavBar.classList.add('l-navbar--hidden');
            } else {
                topNavBar.classList.remove('l-navbar--hidden');
            }
        }

        WDI.utils.position = scroll;
    }
};

WDI.mobileMenu = {
    navbarHeight: function() {
        return $('.l-navbar').outerHeight();
    },
    primaryMenu: $('.l-navbar__primary-nav'),
    secondaryMenu: $('.l-menu'),
    secondaryMenuLinks: $('.l-menu__links'),
    showMenuLinks: function(options) {
        if (!options.links) {
            return;
        }

        options.links.each(function(index) {
            var self = this;
            let time = 0;

            setTimeout(function () {
                $(self).addClass('animated fadeInDown');
            }, time);
    
            time = time + 100;
        });
    },
    init: function() {
        $('.js-open-burger-menu').on('click', function() {
            const burgerElement = $('.burger');

            burgerElement.toggleClass('burger--open');

            // opening burger menu
            if (burgerElement.hasClass('burger--open')) {
                WDI.utils.disableBodyScrolling();

                setTimeout(function() {
                    WDI.mobileMenu.showMenuLinks({links: $('.l-navbar__primary-nav-link')});
                }, 300);
    
                WDI.mobileMenu.primaryMenu.slideToggle(function() {
                    let ua = window.navigator.userAgent;
                    let iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
                    let webkit = !!ua.match(/WebKit/i);
                    let iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
                    let firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                    let mozilla = navigator.userAgent.toLowerCase().indexOf('mozilla') > -1;

                    let primaryMenuHeight = burgerElement.outerHeight() + WDI.mobileMenu.navbarHeight();

                    if (firefox || mozilla) {
                        primaryMenuHeight = primaryMenuHeight+70;
                    }

                    if (WDI.utils.screenSize().x < WDI.utils.screenSize().y) {
                        if (iOSSafari || firefox) {
                            primaryMenuHeight = primaryMenuHeight+100;
                        } else {
                            primaryMenuHeight = primaryMenuHeight+30;
                        }
                    }

                    WDI.mobileMenu.secondaryMenuLinks.css({'padding-top': primaryMenuHeight});
                    WDI.mobileMenu.showMenuLinks({links: $('.l-menu__link')});
                });
                WDI.mobileMenu.secondaryMenu.slideToggle();

            // closing burger menu
            } else {
                $('.l-menu__link, .l-navbar__primary-nav-link')
                    .removeClass('animated')
                    .removeClass('fadeInDown');

                WDI.mobileMenu.primaryMenu.fadeOut(200);
                WDI.mobileMenu.secondaryMenu.fadeOut(200);
                WDI.utils.enableBodyScrolling();

                return;
                // here it's the end for the closing action
            }
        });
    }
};

WDI.megamenu = {
    close: function() {
        const megamenu = $('.megamenu--active');

        if (!megamenu.length) {
            return;
        }

        let megamenuItems = megamenu.find('.megamenu__item');

        this.animateCascadeItems({items: megamenuItems, open: false});

        setTimeout(function() {
            megamenu.slideToggle();
        }, megamenuItems.length * 100);
        
        megamenu.removeClass('megamenu--active');

        // disable "back" button on mobile
        $('.l-navbar__go-back').removeClass('l-navbar__go-back--active');
    },
    animateCascadeItems: function(options) {
        if (!options.items) {
            return;
        }

        let time = 200;
        let items = options.items;

        if (options.open === false) {
            time = 0;
            items = $(items.get().reverse());
        }

        items.each(function(index) {
            var self = this;

            setTimeout(function () {
                if (options.open) {
                    $(self).addClass('animated fadeInDown');
                } else {
                    $(self).addClass('animated fadeOutUp');
                }

            }, time);
    
            time = time + 100;
        });

        if (options.open === false) {
            setTimeout(function() {
                items
                    .removeClass('animated')
                    .removeClass('fadeInDown')
                    .removeClass('fadeOutUp');
            }, time + 500);
        }
    },
    init: function() {
        $('.js-open-megamenu').on('click', function() {
            const megamenuId = $(this).data('open-megamenu-id');
            const megamenu = $('.megamenu[data-megamenu-id="' + megamenuId + '"]');
            let megamenuItems = megamenu.find('.megamenu__item');

            $(this).toggleClass('l-navbar__primary-nav-link--active');
    
            if (megamenu.hasClass('megamenu--active')) {
                WDI.megamenu.close();
            } else {
                let anyOpenedMegamenuId = $('.megamenu--active').data('megamenu-id');
    
                if (anyOpenedMegamenuId !== megamenuId) {
                    $('.megamenu--active').find('.megamenu__item')
                        .removeClass('animated')
                        .removeClass('fadeInDown')
                        .removeClass('fadeOutUp');
                    $('.megamenu--active').removeClass('megamenu--active').fadeOut(200);
                }
    
                megamenu.slideToggle();
                megamenu.addClass('megamenu--active');
                WDI.megamenu.animateCascadeItems({items: megamenuItems, open: true});

                // enable "back" button on mobile
                $('.l-navbar__go-back').addClass('l-navbar__go-back--active');
            }
    
            return false;
        });
    
        $(document).click(function(e) {
            WDI.megamenu.close();

            setTimeout(() => {
                $('.l-navbar__primary-nav-link--active').removeClass('l-navbar__primary-nav-link--active');
            }, 500);
            
        });
    }
};

WDI.sliders = {
    generalSlider: function() {
        let sliders = document.querySelectorAll('.js-general-slider');

        if (!sliders.length) {
            return;
        }
        
        [].forEach.call(sliders, function(slider) {
            let autoplayTimeout = slider.dataset.autoplayTimeout || false;
            let settings = {
                items: slider.dataset.items || 1,
                navigation: false,
                pagination: slider.dataset.pagination || true,
                autoHeight: true,
                autoplayHoverPause: false,
                nav: slider.dataset.nav || true,
                loop: true,
                lazyLoad: true,
            };

            if (slider.classList.contains('owl-carousel--nav-left-right')) {
                settings.navText = ['<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.54 13.52"><path id="Line" d="M0,6.76H25" style="fill:none;stroke:#090b09;stroke-miterlimit:10;stroke-width:2px"/><path id="Path_5" data-name="Path 5" d="M18,.76l7,6-7,6" style="fill:none;stroke:#090b09;stroke-miterlimit:10;stroke-width:2px"/></svg></span>','<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.54 13.52"><path id="Line" d="M0,6.76H25" style="fill:none;stroke:#090b09;stroke-miterlimit:10;stroke-width:2px"/><path id="Path_5" data-name="Path 5" d="M18,.76l7,6-7,6" style="fill:none;stroke:#090b09;stroke-miterlimit:10;stroke-width:2px"/></svg></span>'];
            }
    
            if (autoplayTimeout) {
                settings.autoplay = true;
                settings.autoplayTimeout = autoplayTimeout;
            }
    
            $(slider).owlCarousel(settings);
        });
    },
    init: function() {
        this.generalSlider();
    }
};

// Map for the contact page
WDI.map = {
    loadScript: function() {
        if (!googleMapLoaded) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://maps.googleapis.com/maps/api/js?v=3&key=${googleMapsApiKey}&` +
                'callback=WDI.map.load';
            document.body.appendChild(script);
            googleMapLoaded = true;
        } else {
            WDI.map.load();
        }
    },

    load: function(selector = '.js-map') {
        function init() {
            var draggable;
            var isMobile = function() {
            try{ document.createEvent("TouchEvent"); return true; }
                catch(e){ return false; }
            };
            if(isMobile()) {
                draggable = false;
            } else {
                draggable = true;
            }

            const maps = document.querySelectorAll(selector);
            [].forEach.call(maps, function(mapObj) {

                var myLatLngX = mapObj.getAttribute('data-latitude');
                var myLatLngY = mapObj.getAttribute('data-longitude');

                var mapOptions = {
                    zoom: 15,
                    center: new google.maps.LatLng(myLatLngX,myLatLngY),
                    disableDefaultUI: true,
                    scrollwheel: false,
                    draggable: draggable,

                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE,
                        position: google.maps.ControlPosition.RIGHT_TOP
                    },

                    styles: [
                        {
                            "featureType": "all",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "saturation": "32"
                                },
                                {
                                    "lightness": "-3"
                                },
                                {
                                    "visibility": "on"
                                },
                                {
                                    "weight": "1.18"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "landscape.man_made",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "saturation": "-70"
                                },
                                {
                                    "lightness": "14"
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "transit",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "saturation": "100"
                                },
                                {
                                    "lightness": "-14"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "off"
                                },
                                {
                                    "lightness": "12"
                                }
                            ]
                        }
                    ]
                };

                var mapElement = mapObj;
                var map = new google.maps.Map(mapElement, mapOptions);
                google.maps.event.addDomListener(window, 'resize', function() {
                    var center = map.getCenter();
                    google.maps.event.trigger(map, 'resize');
                    map.setCenter(center);
                });
            });
        }
        init();
    },
    initMap: function() {
        /* jshint ignore:start */
        if ($('.js-map:not(.js-map-on-demand)').length) {
            const mapWaypoint = new Waypoint({
                element: $('.js-map')[0],
                handler: function(direction) {
                    if (direction === 'down') {
                        WDI.map.loadScript();
                    }
                },
                offset: '80%'
            });
        }
        /* jshint ignore:end */
    }
};

WDI.utils.disableBodyScrolling = function() {
    WDI.offsetY = window.pageYOffset;
    $('body').css({top: -WDI.offsetY + 'px'});
    $('body').addClass('stop-scrolling');
};

WDI.utils.enableBodyScrolling = function() {
    $('body').removeClass('stop-scrolling');
    $(window).scrollTop(WDI.offsetY);
};

WDI.calculate100vh = function() {
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

WDI.utils.hashInUrlScrollTo = function()  {
    if (window.location.hash && window.location.hash !== '#contact') {
        WDI.utils.scrollToID(window.location.hash, 'html,body', 80);
    }
};

function runWebsiteScripts() {
    // navigation
    WDI.navigationVisibility();
    WDI.mobileMenu.init();
    WDI.megamenu.init();

    // functionalities
    WDI.sliders.init();
    WDI.utils.hashAnchorClick();
    WDI.utils.openPopupOnClick();
    WDI.utils.magnific();
    WDI.utils.animationedSections();
    WDI.map.initMap();

    setTimeout(function() {
        WDI.utils.hashInUrlScrollTo();
    }, 600);

    // layout
    $('.js-equal-height').matchHeight();
    WDI.calculate100vh();
}

runWebsiteScripts();

window.addEventListener('resize', () => {
    setTimeout(function() {
        Waypoint.refreshAll();
    }, 80);
}, false);

window.addEventListener('scroll', () => {
    WDI.navigationVisibility();
}, false);