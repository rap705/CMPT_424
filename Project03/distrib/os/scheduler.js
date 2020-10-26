var TSOS;
(function (TSOS) {
    var scheduler = /** @class */ (function () {
        function scheduler() {
        }
        scheduler.prototype.roundRobin = function () {
            if (_CurrentStoredPCB.length === 2) {
                if (_CurrentPCB.PID === _CurrentStoredPCB[0].PID) {
                    _Dispatcher.save();
                    _CurrentStoredPCB[0] = _CurrentPCB;
                    _CurrentPCB = _CurrentStoredPCB[1];
                    _Dispatcher.reload();
                }
                else {
                    _Dispatcher.save();
                    _CurrentStoredPCB[1] = _CurrentPCB;
                    _CurrentPCB = _CurrentStoredPCB[0];
                    _Dispatcher.reload();
                }
            }
            else if (_CurrentStoredPCB.length === 3) {
                if (_CurrentPCB.PID === _CurrentStoredPCB[0].PID) {
                    _Dispatcher.save();
                    _CurrentStoredPCB[0] = _CurrentPCB;
                    _CurrentPCB = _CurrentStoredPCB[1];
                    _Dispatcher.reload();
                }
                else if (_CurrentPCB.PID === _CurrentStoredPCB[1].PID) {
                    _Dispatcher.save();
                    _CurrentStoredPCB[1] = _CurrentPCB;
                    _CurrentPCB = _CurrentStoredPCB[2];
                    _Dispatcher.reload();
                }
                else {
                    _Dispatcher.save();
                    _CurrentStoredPCB[2] = _CurrentPCB;
                    _CurrentPCB = _CurrentStoredPCB[0];
                    _Dispatcher.reload();
                }
            }
        };
        return scheduler;
    }()); //End scheduler class
    TSOS.scheduler = scheduler;
})(TSOS || (TSOS = {})); //End TSOS module
