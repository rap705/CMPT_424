/*
Class Description Goes Here
*/
var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory(memRange1, memAva1) {
            if (memRange1 === void 0) { memRange1 = new Array(); }
            if (memAva1 === void 0) { memAva1 = true; }
            this.memRange1 = memRange1;
            this.memAva1 = memAva1;
            this.memRange1 = memRange1;
            this.memAva1 = memAva1;
            //this.init();
        }
        Memory.prototype.init = function () {
            for (var i = 0; i < 256; i++) {
                this.memRange1[i] = "00";
            }
            this.memAva1 = true;
        };
        return Memory;
    }()); //End Memory class
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {})); //End TSOS module
