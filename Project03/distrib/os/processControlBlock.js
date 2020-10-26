var TSOS;
(function (TSOS) {
    var ProcessControlBlock = /** @class */ (function () {
        function ProcessControlBlock(PID) {
            this.PID = PID;
            this.PID = PID;
            this.pcbPriority = 10;
            this.memSegment;
            this.PC = 0;
            this.IR;
            this.Acc;
            this.X;
            this.Y;
            this.Z;
            this.state = "Ready";
        }
        return ProcessControlBlock;
    }());
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
