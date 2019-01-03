'use strict';

let WDI = WDI || {};
let UTILS = UTILS || {};
let googleMapLoaded = false;

const staticFolder = '/images/'

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
    let leftMenu = document.querySelector('.l-menu');

    if (!document.querySelector('body').classList.contains('stop-scrolling') ) {
        scroll = window.scrollY || window.pageYOffset  || document.documentElement.scrollTop;

        if (topNavBar && leftMenu) {
            if (scroll > WDI.utils.position && WDI.utils.position > -1) {
                topNavBar.classList.add('l-navbar--hidden');

                if (!($('.website-holder--open').length)) {
                    leftMenu.classList.add('l-menu--hidden');
                }
            } else {
                topNavBar.classList.remove('l-navbar--hidden');
                leftMenu.classList.remove('l-menu--hidden');
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

WDI.searchForm = function() {
    $('.js-toggle-search-form').on('click', function() {
        const searchForm = $('.l-navbar__search-form');
        
        searchForm.animate({
            width: 'toggle'
        });

        $('#search-phrase').focus();
    });
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
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "saturation": 36
                                },
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": 40
                                }
                            ]
                        },
                        {
                            "featureType": "all",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": 16
                                }
                            ]
                        },
                        {
                            "featureType": "all",
                            "elementType": "labels.icon",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": 20
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": 17
                                },
                                {
                                    "weight": 1.2
                                }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": 20
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": 21
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": 17
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": 29
                                },
                                {
                                    "weight": 0.2
                                }
                            ]
                        },
                        {
                            "featureType": "road.arterial",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": 18
                                }
                            ]
                        },
                        {
                            "featureType": "road.local",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": 16
                                }
                            ]
                        },
                        {
                            "featureType": "transit",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": 19
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "lightness": 17
                                }
                            ]
                        }
                    ]
                };

                var mapElement = mapObj;
                var map = new google.maps.Map(mapElement, mapOptions);
                var image = staticFolder + 'location-pin.svg';
                var marker = new google.maps.Marker({
                    title: '',
                    position: map.getCenter(),
                    map: map,
                    icon: {
                        url: image,
                        scaledSize: new google.maps.Size(50, 71)
                    }
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
                        WDI.map.load();
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

WDI.contact = {
    contactButton: null,
    layer: $('.l-contact'),
    openTopNavbar: function() {
        $('body > .l-navbar').removeClass('l-navbar--hidden');
    },
    hideTopNavbar: function() {
        $('body > .l-navbar').addClass('l-navbar--hidden');
    },
    openContactLayer: function() {
        WDI.contact.layer.fadeIn();
        WDI.contact.layer.addClass('l-contact--opened');
        WDI.map.loadScript();
        WDI.contact.loadMarketoForm();
        WDI.megamenu.close();
    },
    closeContactLayer: function() {
        WDI.contact.layer.fadeOut();
        WDI.contact.layer.removeClass('l-contact--opened');
    },
    runOpeningContact: function(options = {}) {
        if (options.button) {
            WDI.contactButton = options.button;
        }

        WDI.contact.hideTopNavbar();

        setTimeout(function() {
            WDI.backdrop.open();
        }, 100);

        setTimeout(function() {
            WDI.contact.openContactLayer();
        }, 300);

        setTimeout(function() {
            if (WDI.contactButton) {
                WDI.contactButton.addClass('underline-hover--active');
            }

            WDI.utils.disableBodyScrolling();
        }, 1000);
    },
    runClosingContact: function() {
        WDI.contact.closeContactLayer();

        setTimeout(function() {
            WDI.backdrop.close();
        }, 400);

        setTimeout(function() {
            WDI.utils.enableBodyScrolling();
            WDI.contact.openTopNavbar();

            if (WDI.contactButton) {
                WDI.contactButton.removeClass('underline-hover--active');
            }
        }, 300);
    },
    fireContactViaHashId: function() {
        if (window.location.hash && window.location.hash === '#contact') {
            WDI.contact.runOpeningContact({button: $('.js-close-contact-before-leave[href="#contact"]')});
        }
    },
    initLinksToOpenContact: function() {
        $('.website-holder a[href^="#contact"]').on('click', function() {
            if (WDI.contact.layer.hasClass('l-contact--opened')) {
                WDI.contact.runClosingContact();
            } else {
                WDI.contact.runOpeningContact();
            }

            return false;
        });
    },
    loadMarketoForm: function() {
        let marketoForm = WDI.contact.layer.find('form[data-formid]');
        
        if (marketoForm.length === 0) {
            return;
        }

        let formId = marketoForm.data('formid');

        WDI.marketo.loadScript(function() {
            WDI.marketo.loadForm(formId);
        });
    },
    init: function() {
        $('.js-close-contact').on('click', function() {
            WDI.contact.runClosingContact();
            return false;
        });

        $('.l-menu a[href^="#contact"], .l-navbar a[href^="#contact"], .l-footer a[href^="#contact"]').on('click', function() {
            if (WDI.contact.layer.hasClass('l-contact--opened')) {
                WDI.contact.runClosingContact();
            } else {
                WDI.contact.runOpeningContact({button: $(this)});
            }

            return false;
        });

        // open contact layer on initial page load
        this.fireContactViaHashId();
    }
};

WDI.comparisonBlock = {
    selectedDestination: null,
    selectedTechnology: null,
    loadComparison: function({destination, technology}) {
        let id = destination + '-' + technology;
        $('[data-slider-id="' + id + '"]').fadeIn();

        setTimeout(function() {
            $('[data-horizontal-menu-id="' + id + '"]').fadeIn();
        }, 400);

        if (WDI.utils.screenSize().x < 768) {
            WDI.utils.scrollToID('#js-comparison-content');
        }
    },
    hideWelcomeMessage: function() {
        $('.js-welcome-screen').fadeOut(0);
    },
    openWelcomeMessage: function() {
        setTimeout(function() {
            $('.js-welcome-screen').fadeIn();
        }, 300);
    },
    hideOpenComparisons: function() {
        $('.js-comparison-slider').fadeOut(300);
    },
    init: function() {
        // destination selection
        $('.js-select-destination').on('change', function() {
            WDI.comparisonBlock.selectedDestination = $(this).val();
            WDI.comparisonBlock.selectedTechnology = null;
            let disabledTechnologies = $(this).data('disabled-technologies');


            WDI.comparisonBlock.hideOpenComparisons();
            WDI.comparisonBlock.openWelcomeMessage();

            $('.js-select-technology').attr('disabled', false).prop('checked', false);
            disabledTechnologies.forEach(function(technology, index) {
                $('#' + technology).attr('disabled', true);
            });
        });

        // technology selection
        $('.js-select-technology').on('change', function() {
            $('.js-comparison-slider').fadeOut(0);

            WDI.comparisonBlock.selectedTechnology = $(this).val();
            WDI.comparisonBlock.hideWelcomeMessage();
            WDI.comparisonBlock.loadComparison({
                destination: WDI.comparisonBlock.selectedDestination,
                technology: WDI.comparisonBlock.selectedTechnology
            });
        });
    }
};

WDI.meetTheTeam = function() {
    // Meet the team subpage JS, Tabs for team section
    $('.js-tab-btn').off();
    $('.js-tab-btn').on('click', function(){
        var tabTitle = $(this).attr('data-name');

        $('.js-tab-btn').removeClass('team-member--active');
        $(this).addClass('team-member--active');

        $('.js-tab-content:not([data-content="'+ tabTitle +'"])').hide();
        $('[data-content="'+ tabTitle +'"]').slideDown();

        $('[data-close="'+ tabTitle +'"]').on('click', function(){
            $('[data-content="'+ tabTitle +'"]').slideUp();
            $('.js-tab-btn').removeClass('team-member--active');
        });

        var goToTeamMember = $(this).offset().top;
        $('html, body').animate({scrollTop:goToTeamMember - 95}, 'slow');

    });
}

WDI.marketo = {
    podId: "//app-lon02.marketo.com",
    munchkinId: "382-LXN-478",
    MKTOFORM_ID_PREFIX: 'mktoForm_',
    MKTOFORM_ID_ATTRNAME: 'data-formId',

    loadForm: function(formId) {
        if (!formId) {
            return;
        }
        
        formId = parseInt(formId.match(/\d+/),10);
        let loadForm = MktoForms2.loadForm.bind(MktoForms2, WDI.marketo.podId, WDI.marketo.munchkinId, formId),
        formEls = [].slice.call(document.querySelectorAll('[' + WDI.marketo.MKTOFORM_ID_ATTRNAME + '="' + WDI.marketo.MKTOFORM_ID_PREFIX + formId + '"]'));

        (function loadFormCb(formEls) {
            var formEl = formEls.shift();
            formEl.id = WDI.marketo.MKTOFORM_ID_PREFIX + formId;

            if (formEl.classList.contains('mktoForm')) {
                return false;
            }

            loadForm(function(form) {
                formEl.id = '';
                formEl.removeAttribute(WDI.marketo.MKTOFORM_ID_ATTRNAME);

                formEls.length && loadFormCb(formEls);
                let defaultValues = formEl.dataset.defaultValues ? JSON.parse(formEl.dataset.defaultValues) : [];
                let hiddenFields = formEl.dataset.hiddenFields ? JSON.parse(formEl.dataset.hiddenFields) : null;

                defaultValues.forEach(function(item) {
                    if (item.id && item.value) {
                        $(formEl).find('#' + item.id).val(item.value);
                    }
                });

                if (hiddenFields && hiddenFields.id && hiddenFields.value) {
                    let values = {};
                    values[ hiddenFields.id ] = hiddenFields.value;
                    form.setValues(values);
                }

                form.onSuccess(function (values, followUpUrl) {
                    $(formEl).parent().find('.mkto-notice').text('Your message was successfully sent.');
                    $(formEl).parent().find('.mkto-notice').slideDown(300);
                    $(formEl)[0].reset();
                    $(formEl).find('button[type="submit"]').text('Submit');

                    if (window['dataLayer'] !== undefined) {
                        window.dataLayer.push({
                            event: formEl.dataset['gtmEvent'] || 'contact-form-submission',
                            formLabel: 'Marketo Form ID: ' + formId,
                            formResult: 'Successful Submission'
                        });
                    }

                    return false;
                });

            });
        })(formEls);
    },

    loadScript: function(callback) {
        if (WDI.marketoScriptLoaded === false) {
            $.ajax({
                url: 'https://app-lon02.marketo.com/js/forms2/js/forms2.min.js',
                dataType: 'script',
                cache: true,
                success: function() {
                    WDI.marketoScriptLoaded = true;
                    callback();
                }
            });
        } else {
            callback();
        }
    },

    init: function() {
        let formList = document.querySelectorAll(".marketo form:not(.mktoForm)");
        let marketoFormWaypoint;

        [].forEach.call(formList, function(form) {
            marketoFormWaypoint = new Waypoint({
                element: form,
                handler: function(direction) {
                    if (direction === 'down') {
                        let formId = form.dataset.formid;
                        let runOnDemand = form.dataset.runOnDemand || false;

                        if (runOnDemand === false) {
                            WDI.marketo.loadScript(function() {
                                WDI.marketo.loadForm(formId);
                            });
                        }

                        this.destroy();
                    }
                },
                offset: '85%'
            });
        });
    }
};

WDI.selectBox = {
    redirectType: function() {
        $('.js-select-redirect').each(function(index) {
            var self = this;
            $(self).css('display', 'none');

            $(self).selectbox({
                onOpen: function (inst) {
                    var id = inst.uid,
                        selectedText = $('#sbSelector_'+id).text(),
                        options = $('#sbOptions_'+id+' li');

                    options.each(function(index) {
                        if ( $(this).find('a').text() === selectedText ) {
                            $(this).addClass('selected');
                        } else {
                            $(this).removeClass('selected');
                        }
                    });
                },
                onClose: function (inst) {

                },
                onChange: function (val, inst) {
                    $(self).val(val).change();

                    if (val !== '-1') {
                        window.location = val;
                    }
                    if (val === 0) {
                        $(self).parent().find('.sbHolder').removeClass('selected');
                    } else {
                        $(self).parent().find('.sbHolder').addClass('selected');
                    }
                },
                effect: "slide"
            });
        });
    },
    ajaxType: function() {
        $('.js-filter-ajax').each(function(index) {
            var self = this;
            $(self).css('display', 'none');
            $('.sbOptions a').attr('href', '');
            $(self).selectbox({
                onOpen: function (inst) {
                    var id = inst.uid,
                        selectedText = $('#sbSelector_'+id).text(),
                        options = $('#sbOptions_'+id+' li');

                    options.each(function(index) {
                        if ( $(this).find('a').text() === selectedText ) {
                            $(this).addClass('selected');
                        } else {
                            $(this).removeClass('selected');
                        }
                    });
                },
                onClose: function (inst) {

                },
                onChange: function (val, inst) {
                    $(self).val(val).change();

                    if (val !== '-1') {

                        var selectSourceUID = inst.uid,
                            sourceSelect = document.querySelector('[sb="'+selectSourceUID+'"]'),
                            filterType = $(this).data('filter-type'),
                            selectedOption = $(sourceSelect).find(":selected"),
                            slug = val,
                            withoutTopicRefinement = selectedOption.data('no-topics') || false;

                        WDI.refinement.filterBy(filterType, slug, withoutTopicRefinement);

                    }
                    if (val === 0) {
                        $(self).parent().find('.sbHolder').removeClass('selected');
                    } else {
                        $(self).parent().find('.sbHolder').addClass('selected');
                    }
                },
                effect: "slide"
            });
        });

        $('.js-refine-by-topic').on('click', function() {
            let topicSlug = $(this).data('slug');
            WDI.refinement.filterBy('label', topicSlug, false);

            return false;
        });
    },
    init: function() {
        this.redirectType();
        this.ajaxType();
    }
};

WDI.refinement = {
    groupRevealed: null,
    getCurrentCategorySlug: function() {
        return $('[data-filter-category]').attr('data-filter-category');
    },
    getCategoryName: function(slug) {
        var name = $('[data-param="' + slug + '"]').html();

        if (name) {
            name = name.trim();
        }

        return name;
    },
    getLabelName: function(slug) {
        var name = $('input[value="' + slug + '"]').parent().find('.js-label-name').html();

        if (name) {
            name = name.trim();
        }

        return name;
    },
    getCurrentLabelSlug: function() {
        return $('input[name="labelSlug"]:checked').val();
    },
    filterBy: function(type, value, withoutTopicRefinement) {
        var categorySlug = WDI.refinement.getCurrentCategorySlug();
        var labelSlug = WDI.refinement.getCurrentLabelSlug();
        var url;

        if (type === 'category') {
            if (withoutTopicRefinement) {
                url = value;
                WDI.refinement.trackEvent(value);
            } else {
                url = value + (labelSlug ? '/' + labelSlug : '');
                WDI.refinement.trackEvent(value, labelSlug);
            }

        } else if (type === 'label') {
            url = categorySlug + '/' + value;
            WDI.refinement.trackEvent(categorySlug, value);

        } else {
            url = categorySlug;
            WDI.refinement.trackEvent(categorySlug);
        }

        history.pushState({url: url}, null, url);
        WDI.pushStateCounter++;
        WDI.refinement.requestContent(url);
    },
    trackEvent: function(categorySlug, labelSlug) {
        var ga = window.ga || null;
        if (!ga) {
            return true;
        }

        var categoryName = WDI.refinement.getCategoryName(categorySlug);
        var labelName = WDI.refinement.getLabelName(labelSlug);
        var data = {
            'hitType': 'event',
            'eventCategory': 'Resources: ' + categoryName,
            'eventAction': labelSlug ? 'refined with' : 'selected',
            'eventLabel': labelSlug ? labelSlug : ''
        };

        ga('send', data);
    },
    findParams: function(value) {

        if (value.indexOf('?') >= 0) {
            value += '&';
        } else {
            value += '?';
        }

        return value + Math.random();
    },
    requestContent: function(url) {
        $('.loading').fadeIn();

        if (WDI.infiniteElement) {
            WDI.infiniteElement.destroy();
        }

        if ( url.slice(-1) === '/' ) {
            url = url.slice(0, -1);
        }

        url += (WDI.refinement.groupRevealed ? '?groupRevealed=' + WDI.refinement.groupRevealed : '');
        var newUrl = WDI.refinement.findParams(url);

        setTimeout(function() {
            $.ajax({
                url: newUrl,
                dataType: 'html',
                success: function(responseText) {

                    $('#js-content').replaceWith(responseText);

                    var codes = $('#js-content').find("script");

                    for (var i=0; i<codes.length; i++) {
                        eval(codes[i].text);
                    }

                    document.title = WDI.metaTags.title;
                    $('meta[name=description]').attr('content', WDI.metaTags.description);

                    $('html, body').animate({ scrollTop: 0 }, 'slow');

                    Waypoint.destroyAll();

                    setTimeout(function() {
                        Waypoint.refreshAll();
                        runUniversalScripts();
                    }, 200);

                    setTimeout(function() {
                        $('.loading').fadeOut();
                    }, 200);
                },

                error: function(responseText) {
                    setTimeout(function() {
                        $('.loading').fadeOut();
                    }, 200);
                }
            });
        }, 300);

        return false;
    },
    initPopstate: function() {
        window.addEventListener('popstate', function(e) {
            var character = e.state;

            if (character === null && WDI.pushStateCounter) {
                location.reload();
            } else if (character && character.url) {
                WDI.refinement.requestContent(character.url);
            }
        });
    },

    // static refinement (refine on the same page, like on Awards page)
    static: function() {
        /* function needed on Awards page for the refinement - it reorders columns in entries once they filtered */

        function adjustColumnsFeaturedWidth() {
            var i = 0;
            $('.js-toRefine:not(.js-invisible)').each(function(entry) {
                var column = $(this).find('div[class*="col-"]');
                column.removeClass("col-md-push-7 col-md-pull-5");

                if (i%2 != 0) {
                    column.first().addClass("col-md-push-7");
                    column.eq(1).addClass("col-md-pull-5");
                }

                i++;
            });
        }

        $('.refinement--dynamic .sbOptions a').on('click', function() {
            var category = $(this).attr('rel');

            if (category == 'all') {
                $('.js-toRefine').removeClass('js-invisible').fadeIn(200);
            } else {
                category = parseInt(category);
                $('.js-toRefine').addClass('animation-fadeInUp js-invisible').fadeOut(0);

                var array = $('.js-toRefine').map(function(){
                    if ($(this).data('id').indexOf(category) > -1) {
                        $(this).removeClass('js-invisible').fadeIn(0);
                    }
                }).get();

                setTimeout(() => WDI.utils.animationedSections(), 200);
            }
            adjustColumnsFeaturedWidth();

            return false;
        });
    },
    init: function() {
    }
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

WDI.calculator = function() {
    var sizenum = 14;

    let bps = new Array(sizenum);
    bps[1] =  "14400.0";
    bps[2] =  "28800.0";
    bps[3] =  "56000.0";
    bps[4] =  "64000.0";
    bps[5] =  "128000.0";
    bps[6] =  "256000.0";
    bps[7] =  "384000.0";
    bps[8] =  "512000.0";
    bps[9] =  "1000000.0";
    bps[10] = "2000000.0";
    bps[11] = "10000000.0";
    bps[12] = "100000000.0";
    bps[13] = "1000000000.0";
    bps[14] = "10000000000.0";

    function getFactor() {
        return $('input[name=fileSizeType]:checked').val();
    }

    function calc() {
        var factor = getFactor();
        var filesize = parseFloat($('#fileSize').val());

        if(factor != 0 && filesize != "NaN") {
            for (let x = 9; x <= sizenum; x++) {
                var filetime = (factor * filesize) / ((bps[x]/8)/1024);

                let millenium = Math.floor(filetime / 31536000000);
                filetime = filetime - (millenium * 31536000000)

                let century = Math.floor(filetime / 3153600000);
                filetime = filetime - (century * 3153600000)

                let year = Math.floor(filetime / 31536000);
                filetime = filetime - (year * 31536000);

                let day = Math.floor(filetime / 86400);
                filetime = filetime - (day * 86400)

                let hour = Math.floor(filetime / 3600);
                filetime = filetime - (hour * 3600);

                let minute = Math.floor(filetime / 60);
                filetime = filetime - (minute * 60);

                let second = Math.floor(filetime);

                var resultString = "";
                if (hour <= 0 && minute <= 0 && second <= 0 && day <= 0 && year <= 0 && century <= 0 && millenium <= 0) {
                    resultString = "Less than a second";
                } else {
                    if (century >= 1 || millenium >= 1) {
                        resultString = "Impractical length of time!";
                    } else {
                        if (millenium > 0) {
                            if(millenium == 1) {
                                resultString = resultString + millenium + " millenium, ";
                            } else {
                                resultString = resultString + millenium + " millenia, ";
                            }
                        }
                        if (century > 0) {
                            if(century == 1) {
                                resultString = resultString + century + " century, ";
                            } else {
                                resultString = resultString + century + " centuries, ";
                            }
                        }
                        if (year > 0) {
                            if(year == 1) {
                                resultString = resultString + year + " year, ";
                            } else {
                                resultString = resultString + year + " years, ";
                            }
                        }
                        if (day > 0) {
                            if(day == 1) {
                                resultString = resultString + day + " day, ";
                            } else {
                                resultString = resultString + day + " days, ";
                            }
                        }
                        if (hour > 0) {
                            if(hour == 1) {
                                resultString = resultString + hour + " hr, ";
                            } else {
                                resultString = resultString + hour + " hrs, ";
                            }
                        }
                        if (minute > 0) {
                            if(minute == 1) {
                                resultString = resultString + minute + " min, ";
                            } else {
                                resultString = resultString + minute + " mins, ";
                            }
                        }
                        if (second > 0) {
                            if(second == 1) {
                                resultString = resultString + second + " sec, ";
                            } else {
                                resultString = resultString + second + " secs, ";
                            }
                        }
                        resultString = resultString.slice(0,resultString.length - 2);
                    }
                }
                var obj = document.getElementById("time"+x);
                obj.innerHTML = resultString;

            };
            return false;
        }

    }

    $('#calcNow').click(function(){
        calc();
    });

    $('form[name="fileInfo"]').submit(function(event){
        event.preventDefault();
        calc();
    });

    $('input[name=fileSizeType]').change(function(){
        calc();
    });

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

WDI.utils.setCookie = function({name, val, days}) {
    var expires;

    if (days) {
        var data = new Date();
        data.setTime(data.getTime() + (days * 24*60*60*1000));
        expires = "; expires="+data.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + val + expires + "; path=/";
};

WDI.utils.isCookieSet = function({name}) {
    if (document.cookie!=='') {
        var cookies=document.cookie.split("; ");

        for (var i=0; i<cookies.length; i++) {
            var cookieName=cookies[i].split("=")[0];
            var cookieVal=cookies[i].split("=")[1];

            if (cookieName === name) {
                return decodeURI(cookieVal);
            }
        }
    }
}

function hashInUrlScrollTo() {
    if (window.location.hash && window.location.hash !== '#contact') {
        WDI.utils.scrollToID(window.location.hash, 'html,body', 80);
    }
}

function runUniversalScripts(options = {}) {
    WDI.sliders.init();

    WDI.utils.animationedSections();

    $('.js-equal-height').matchHeight();
    $('.js-equal-height-2').matchHeight();
    $('.js-equal-height-3').matchHeight();

    WDI.utils.infiniteScroll( WDI.waypointCallback );
    WDI.selectBox.init();

    WDI.utils.hashAnchorClick();
    WDI.utils.openPopupOnClick();
    WDI.utils.magnific();
}

function runWebsiteScripts(options) {
    runUniversalScripts(options);


    WDI.scrollToActiveElement();
    

    WDI.calculate100vh();
    WDI.comparisonBlock.init();

    
    WDI.sidebar();
    
    WDI.accordion.init();
    WDI.calculator();


    WDI.skrollr();

        
    WDI.meetTheTeam();
    WDI.contact.initLinksToOpenContact();

    

    WDI.marketo.init();
    
    setTimeout(function() {
        hashInUrlScrollTo();
    }, 600);
}

function runWebsiteScriptsOnce() {
    WDI.navigationVisibility();
    WDI.mobileMenu.init();
    WDI.searchForm();
    WDI.megamenu.init();
    WDI.contact.init();

    WDI.selectBox.init();
}

function trackPageGTM() {
    if (window['dataLayer'] !== undefined) {
        let pagePath = window.location.pathname;
        
        window.dataLayer.push({
            'event': 'content-view',
            'content-name': pagePath
        });
    }
}

/*
 * -----------------------------------------------------------
 * // Dynamic loading via Barba.js and its settings start here
 *
*/
const FadeTransition = Barba.BaseTransition.extend({
    start: function() {
        Promise
        .all([this.fadeOut(), this.newContainerLoading])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
        var deferred = new jQuery.Deferred();
        let menuWasOpened = false;
        let fadeOutTimeout = 200;
        const burger = document.querySelector('.burger');
    
        if (burger) {
            if (burger.classList.contains('burger--open')) {
                burger.click();
                menuWasOpened = true;
            }
        }

        Waypoint.destroyAll();

        if (WDI.skrollrInstance) {
            WDI.skrollrInstance.destroy();
        }

        setTimeout(function() {
            $("html, body").animate({ scrollTop: 0 }, "fast");
            deferred.resolve();
        }, fadeOutTimeout);

        let transition = {};

        if (!($('.website-holder--open').length)) {
            $('.curtain').addClass('curtain--active');
            transition = {
                opacity: 0
            }
        }

        return deferred.promise().then(() => {
            return $(this.oldContainer).animate(transition, 200).promise();
        });
    },

    fadeIn: function() {
        function destroyOwlCarousels() {
            if (!($('.owl-loaded').length)) {
                return;
            }
    
            $('.owl-loaded').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
            $('.owl-loaded').find('.owl-stage-outer').children().unwrap();
        }

        var _this = this;
        var $el = $(this.newContainer);
        let curtainHideTimeout = 0;
        let fadeInDelay = 0;
        let transition = {
            opacity: 1
        }
        
        if ($('.website-holder--open').length && $el.find('.l-sidebar').length === 0) {
            $('.curtain').addClass('curtain--active');
            fadeInDelay = 0;

            curtainHideTimeout = 500;
        }

        destroyOwlCarousels();

        setTimeout(function() {
            $(this.oldContainer).hide();
        }, curtainHideTimeout ? curtainHideTimeout-400 : 0);

        $el.css({
            visibility : 'visible',
            opacity : 0
        });

        setTimeout(function() {
            $('.curtain').removeClass('curtain--active');
        }, curtainHideTimeout ? curtainHideTimeout + 300 : curtainHideTimeout);

        function recalculateEqualRowsInFooter() {
            $('.l-footer .js-equal-height').matchHeight();
        }
        
        setTimeout(function() {
            $el.animate(transition, 0, function() {
                let sidebar = $el.find('.l-sidebar');
                let websiteHolder = $('.website-holder');

                if (sidebar.length) {
                    if (WDI.utils.isCookieSet({name: 'sidebarOpen'}) === undefined) {
                        setTimeout(function() {
                            websiteHolder.addClass('website-holder--open');
                        }, 400);

                        setTimeout(function() {
                            recalculateEqualRowsInFooter();
                        }, 800);
                    }

                    hashInUrlScrollTo();
                    _this.done();

                } else if (!sidebar.length && websiteHolder.hasClass('website-holder--open')) {
                    websiteHolder.removeClass('website-holder--open');
                    recalculateEqualRowsInFooter();

                    setTimeout(function() {
                        hashInUrlScrollTo();
                        _this.done();
                    }, 600);
                } else {
                    hashInUrlScrollTo();
                    _this.done();
                }

            });
        }, fadeInDelay);
    }
});

Barba.Pjax.getTransition = function() {
    return FadeTransition;
};

Barba.Pjax.originalPreventCheck = Barba.Pjax.preventCheck;

Barba.Pjax.preventCheck = function(evt, element) {
    if ($(element).attr('href') && $(element).attr('href').indexOf('#') > -1)
        return true;
    else
        return Barba.Pjax.originalPreventCheck(evt, element)
};

Barba.Dispatcher.on('transitionCompleted', function(currentStatus, oldStatus) {
    let firstTime = oldStatus ? false : true;
    runWebsiteScripts({firstTime});

    if ( !($('#critical-css').length) ) {
        window.location.reload();
    }
});

Barba.Dispatcher.on('newPageReady', function(current, prev, container) {
    history.scrollRestoration = 'manual';
    trackPageGTM();

    if ($('body').hasClass('stop-scrolling')) {
        WDI.utils.enableBodyScrolling();
    }
});
/*
* -----------------------------------------------------------
*/


let barbaContainer = $('.barba-container').length;

if (barbaContainer) {
    Barba.Pjax.start();
    Barba.Pjax.getTransition();
    Barba.Pjax.cacheEnabled = false;
    Barba.Prefetch.init();
    
} else {
    runWebsiteScripts();
}

runWebsiteScriptsOnce();



window.addEventListener('resize', function() {
    setTimeout(function(){
        Waypoint.refreshAll();
    }, 80);

}, false);

window.addEventListener('scroll', function() {
    WDI.navigationVisibility();
}, false);