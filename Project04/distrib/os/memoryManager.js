var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        //This checks to make sure that there is memory available and returns true if there is
        MemoryManager.prototype.checkAvailabilty = function () {
            if (_Memory.memAva1) {
                return _Memory.memAva1;
            }
            else if (_Memory.memAva2) {
                return _Memory.memAva2;
            }
            else if (_Memory.memAva3) {
                return _Memory.memAva3;
            }
            else {
                return false;
            }
        };
        //This will change the status of the specified memory segment
        MemoryManager.prototype.changeAvailabilityStatus = function (segment) {
            if (segment === 0) {
                if (_Memory.memAva1) {
                    _Memory.memAva1 = false;
                }
                else {
                    _Memory.memAva1 = true;
                }
            }
            else if (segment === 1) {
                if (_Memory.memAva2) {
                    _Memory.memAva2 = false;
                }
                else {
                    _Memory.memAva2 = true;
                }
            }
            else if (segment === 2) {
                if (_Memory.memAva3) {
                    _Memory.memAva3 = false;
                }
                else {
                    _Memory.memAva3 = true;
                }
            }
        };
        MemoryManager.prototype.getAvailableMem = function () {
            if (_Memory.memAva1) {
                return 0;
            }
            else if (_Memory.memAva2) {
                return 1;
            }
            else if (_Memory.memAva3) {
                return 2;
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
