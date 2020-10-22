var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        MemoryManager.prototype.checkAvailabilty = function () {
            if (_Memory.memAva1) {
                return _Memory.memAva1;
            }
            else {
                return false;
            }
        };
        MemoryManager.prototype.changeAvailabiltyStatus = function () {
            if (_Memory.memAva1) {
                _Memory.memAva1 = false;
            }
            else {
                _Memory.memAva1 = true;
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
