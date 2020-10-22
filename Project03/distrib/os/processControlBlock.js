var TSOS;
(function (TSOS) {
    var ProcessControlBlock = /** @class */ (function () {
        function ProcessControlBlock(PID) {
            this.PID = PID;
            this.PID = PID;
            this.pcbStatus = "Ready";
            this.pcbPriority = 10;
            this.memSegment;
        }
        return ProcessControlBlock;
    }());
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
