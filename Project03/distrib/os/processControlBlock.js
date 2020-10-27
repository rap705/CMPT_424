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
            this.Acc = 0;
            this.X = 0;
            this.Y = 0;
            this.Z = 0;
            this.state = "Resident";
            this.base = 0;
            this.limit = 0;
        }
        return ProcessControlBlock;
    }());
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
