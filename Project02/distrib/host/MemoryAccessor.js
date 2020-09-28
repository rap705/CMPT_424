/*
Class Description Goes Here
*/
var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
        }
        MemoryAccessor.prototype.read = function (address) {
            return _Memory.memRange1[address];
        };
        MemoryAccessor.prototype.writeMem = function (data) {
            var opCodeCounter = 0;
            if (data.length / 2 <= 256) {
                for (var i = 0; i < data.length / 2; i++) {
                    _Memory.memRange1[i] = data.substring(opCodeCounter, opCodeCounter + 2);
                    opCodeCounter += 2;
                }
            }
        };
        return MemoryAccessor;
    }()); //End MemoryAccessor class
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {})); //End TSOS module
