/* global describe, it, expect, beforeEach, sinon, afterEach */
/*jshint unused:false*/

(function () {
    'use strict';

    describe('#true', function() {
        it('should check true is true', function() {
            var isTrue = true;
            expect(isTrue).to.equal(true);
        });
    });

    // describe('#checkSumFuction', function() {
    //     it('should check if 2 + 4 == 6', function() {
    //         var psw = BP_OBJECT.utils.sum(2,4);
    //         expect(psw).to.equal(6);
    //     });
    // });

    // describe('#checkMultiFuction', function() {
    //     it('should check if 2 * 4 == 8', function() {
    //         var psw = BP_OBJECT.utils.multi(2,4);
    //         expect(psw).to.equal(8);
    //     });
    // });

})();