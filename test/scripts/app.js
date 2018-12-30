'use strict';

var BP_BOILERPLATE = BP_BOILERPLATE || {};
var UTILS = UTILS || {};

BP_BOILERPLATE.utils = UTILS || {};


UTILS.sum = function (a, b) {
    return a + b;
};

console.log(BP_BOILERPLATE.utils);
console.log(BP_BOILERPLATE.utils.sum(2, 4));

BP_BOILERPLATE.utils.sum(2, 4);
BP_BOILERPLATE.utils.hashAnchorClick();
UTILS.hashAnchorClick();