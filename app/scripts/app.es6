'use strict';

let WDI = WDI || {};
let UTILS = UTILS || {};
let googleMapLoaded = false;

WDI.skrollrInstance = null;
WDI.utils = UTILS || {};
WDI.metaTags = {};
WDI.scrollableAreaPosition = null;
WDI.marketoScriptLoaded = false;

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

WDI.sidebar = function() {
    $('.js-toggle-sidebar-mobile').on('click', function() {
        let sidebar = $('.l-sidebar');
        
        if (sidebar.hasClass('l-sidebar--open')) {
            WDI.utils.enableBodyScrolling();
            sidebar.removeClass('l-sidebar--open');
        } else {
            WDI.utils.disableBodyScrolling();
            sidebar.addClass('l-sidebar--open');
        }

        return false;
    });
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
                megamenu.addClass('megamenu--active')
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

WDI.skrollr = function() {
    if (!document.querySelector('.skrollr')) {
        return;
    }

    WDI.skrollrInstance = skrollr.init();

    if (WDI.skrollrInstance.isMobile()) {
        WDI.skrollrInstance.destroy();
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
    
            $(slider).owlCarousel(settings)
        });
    },
    customSlider: function() {
        let sliders = $('.js-custom-slider');

        if (!sliders.length) {
            return;
        }
        sliders.each(function() {
            let slider = $(this);
            let sliderId = slider.data('slider-id');

            let settings = {
                items: 1,
                navigation: false,
                pagination: true,
                autoHeight: true,
                autoplayHoverPause: true,
                nav: true,
                mouseDrag: false,
                loop: slider.find('> *').length > 1
            };

            slider = slider.owlCarousel(settings);

            $('.js-custom-slider-menu[data-slider-menu-id="' + sliderId + '"]').on('click', 'button', function() {
                let slideId = $(this).data('slide-id');
                slider.trigger('to.owl.carousel', [slideId, 500, true]);

                $(this).closest('.js-custom-slider-menu').find('.underline-hover--active').removeClass('underline-hover--active');
                setTimeout(() => {
                    $(this).addClass('underline-hover--active');
                }, 300);
            });
        });
    },
    tabs: function() {
        let sliders = $('.js-tabs');

        if (!sliders.length) {
            return;
        }
        sliders.each(function() {
            let slider = $(this);
            let sliderId = slider.data('slider-id');

            let settings = {
                items: 1,
                navigation: false,
                pagination: false,
                autoHeight: true,
                autoplay: false,
                autoplayHoverPause: false,
                nav: false,
                mouseDrag: false
            };
            let activeTabElement = $(this).parent().find('[data-active-tab-class]').length ? $(this).parent().find('[data-active-tab-class]').data('active-tab-class') : 'tabs__link--active';

            if ($('.' + activeTabElement).length) {
                settings.onDragged = function(event) {
                    slider.parent().find('.' + activeTabElement).removeClass(activeTabElement);
                    slider.parent().find('[data-slide-id="' + event.item.index + '"]').addClass(activeTabElement);
                };
            }

            slider = slider.owlCarousel(settings);

            $('.js-tabs-menu[data-slider-menu-id="' + sliderId + '"]').on('click', 'button', function() {
                let slideId = $(this).data('slide-id');
                slider.trigger('to.owl.carousel', [slideId, 500, true]);

                $(this).closest('.js-tabs-menu').find('.' + activeTabElement).removeClass(activeTabElement);
                $(this).addClass(activeTabElement);
            });
        });
    },
    boxCarousel: function() {
        let sliders = $('.js-box-carousel');

        if (!sliders.length) {
            return;
        }

        // becuase there is left offset for the slider if there are more than 4 items, if you slide right, the last element is not 100% visible
        // that's why I decided to add an empty item to help slide the carousel to the very end and this way last item is visible 100%
        function addOrRemoveEmptyItem({slider}) {
            if (!slider) {
                return;
            }

            if (!slider.hasClass('owl-carousel--left-offset')) {
                return;
            }

            if (WDI.utils.screenSize().x > 1200) {
                if (!slider.find('.js-additional-empty-item').length) {
                    slider.append('<div class="js-additional-empty-item"></div>');
                }
            } else {
                if (slider.find('.js-additional-empty-item').length) {
                    slider.find('.js-additional-empty-item').remove();
                }
            }
        }

        sliders.each(function() {
            let slider = $(this);

            let settings = {
                responsive:{
                    0: {
                        items: 1
                    },
                    768: {
                        items: 2
                    },
                    1200: {
                        items: 3
                    },
                    2000: {
                        items: 4
                    }
                },
                margin: 40,
                navigation: false,
                pagination: false,
                autoHeight: true,
                autoplayHoverPause: false,
                nav: slider.data('nav') || true,
                navText: ['<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.54 13.52"><path id="Line" d="M0,6.76H25" style="fill:none;stroke:#090b09;stroke-miterlimit:10;stroke-width:2px"/><path id="Path_5" data-name="Path 5" d="M18,.76l7,6-7,6" style="fill:none;stroke:#090b09;stroke-miterlimit:10;stroke-width:2px"/></svg></span>','<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.54 13.52"><path id="Line" d="M0,6.76H25" style="fill:none;stroke:#090b09;stroke-miterlimit:10;stroke-width:2px"/><path id="Path_5" data-name="Path 5" d="M18,.76l7,6-7,6" style="fill:none;stroke:#090b09;stroke-miterlimit:10;stroke-width:2px"/></svg></span>'],
                mouseDrag: true,
                loop: false,
                onInitialize: function() {
                    addOrRemoveEmptyItem({slider});
                },
                onResized: function() {
                    addOrRemoveEmptyItem({slider});
                }
            };

            slider = slider.owlCarousel(settings);
        });
    },
    init: function() {
        this.generalSlider();
        this.customSlider();
        this.boxCarousel();
        this.tabs();
    }
};

WDI.scrollToActiveElement = function() {
    const scrollableArea = $('.js-scroll-to-active-element');
    const activeElement = $('.js-scroll-to-active-element .js-active');
    let scrollTopPosition = null;
    let topOffset;
    
    if (!activeElement.length || !scrollableArea.length) {
        WDI.scrollableAreaPosition = null;
        return;
    }

    // horizontal
    if (WDI.utils.screenSize().x <= 767) {
        let leftOffset = activeElement.offset().left - scrollableArea.offset().left + scrollableArea.scrollLeft() - 25;

        scrollableArea.animate({ scrollLeft: leftOffset });
    } 

    // vertical
    else {
        topOffset = activeElement.offset().top - scrollableArea.offset().top + scrollableArea.scrollTop() - 25;
        scrollableArea.animate({ scrollTop: topOffset });
    }
};

WDI.backdrop = {
    layer: $('.backdrop'),
    open: function() {
        this.layer.addClass('backdrop--opened');
    },
    close: function() {
        this.layer.removeClass('backdrop--opened');
    }
};

// Map for the contact page
WDI.map = {
    loadScript: function() {
        if (!googleMapLoaded) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyAanzKjF6LiHz-vILwxR2Tp_X4IFjeuVmo&' +
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
                var marker = new google.maps.Marker({
                    title: '',
                    position: map.getCenter(),
                    map: map
                });

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

WDI.accordion = {
    init: function() {
        $('.js-toggle-accordion').on('click', function() {
            let accordion = $(this).closest('.accordion');
            accordion.toggleClass('accordion--active');
            accordion.find('.accordion__content').slideToggle();

            return false;
        });
    }
};

WDI.waypointCallback = function() {
    WDI.utils.animationedSections();
    $('.js-equal-height').matchHeight();
    
    WDI.utils.hashAnchorClick();
    WDI.utils.openPopupOnClick();
    WDI.utils.magnific();
};

WDI.calculate100vh = function() {
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

function hashInUrlScrollTo() {
    if (window.location.hash && window.location.hash !== '#contact') {
        WDI.utils.scrollToID(window.location.hash, 'html,body', 80);
    }
}

function runUniversalScripts() {
    WDI.sliders.init();

    WDI.utils.animationedSections();

    $('.js-equal-height').matchHeight();

    WDI.utils.infiniteScroll( WDI.waypointCallback );

    WDI.utils.hashAnchorClick();
    WDI.utils.openPopupOnClick();
    WDI.utils.magnific();
}

function runWebsiteScripts() {
    runUniversalScripts();

    WDI.scrollToActiveElement();
    WDI.calculate100vh();
    WDI.sidebar();
    WDI.accordion.init();
    WDI.skrollr();
    WDI.map.initMap();
    
    setTimeout(function() {
        hashInUrlScrollTo();
    }, 600);
}

function runWebsiteScriptsOnce() {
    WDI.navigationVisibility();
    WDI.mobileMenu.init();
    WDI.megamenu.init();
}

runWebsiteScriptsOnce();
runWebsiteScripts();


window.addEventListener('resize', function() {
    setTimeout(function(){
        Waypoint.refreshAll();
    }, 80);

}, false);

window.addEventListener('scroll', function() {
    WDI.navigationVisibility();
}, false);