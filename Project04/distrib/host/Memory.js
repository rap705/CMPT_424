var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory(memRange, memAva1, memAva2, memAva3) {
            if (memRange === void 0) { memRange = new Array(); }
            if (memAva1 === void 0) { memAva1 = true; }
            if (memAva2 === void 0) { memAva2 = true; }
            if (memAva3 === void 0) { memAva3 = true; }
            this.memRange = memRange;
            this.memAva1 = memAva1;
            this.memAva2 = memAva2;
            this.memAva3 = memAva3;
            this.memRange = memRange;
            this.memAva1 = memAva1;
            this.memAva2 = memAva2;
            this.memAva3 = memAva3;
            //this.init();
        }
        Memory.prototype.init = function () {
            for (var i = 0; i < 768; i++) {
                this.memRange[i] = "00";
            }
            this.memAva1 = true;
        };
        return Memory;
    }()); //End Memory class
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {})); //End TSOS module
