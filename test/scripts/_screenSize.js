'use strict';

/**
               * 
               * Return width and height of current browser sizes
               * 
               */

var UTILS = UTILS || {};

UTILS._screenSize = function _screenSize() {
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight,
    sizes = { x: x, y: y };
    return sizes;
};