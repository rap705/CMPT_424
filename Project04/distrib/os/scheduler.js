var TSOS;
(function (TSOS) {
    var scheduler = /** @class */ (function () {
        function scheduler() {
        }
        scheduler.roundRobin = function () {
            var interrupt = new TSOS.Interrupt(SOFTWARE_IRQ, [0]);
            if (_CurrentStoredPCB.length >= 2) {
                _Kernel.krnTrace("Context Switch with Round Robin");
                _KernelInterruptQueue.enqueue(interrupt);
            }
        };
        return scheduler;
    }()); //End scheduler class
    TSOS.scheduler = scheduler;
})(TSOS || (TSOS = {})); //End TSOS module
