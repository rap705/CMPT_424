var TSOS;
(function (TSOS) {
    var dispatcher = /** @class */ (function () {
        function dispatcher() {
        }
        dispatcher.prototype.save = function () {
            _CurrentPCB.PC = _CPU.PC;
            _CurrentPCB.Acc = _CPU.Acc;
            _CurrentPCB.X = _CPU.Xreg;
            _CurrentPCB.Y = _CPU.Yreg;
            _CurrentPCB.Z = _CPU.Zflag;
        };
        dispatcher.prototype.reload = function () {
            _CPU.PC = _CurrentPCB.PC;
            _CPU.Acc = _CurrentPCB.Acc;
            _CPU.Xreg = _CurrentPCB.X;
            _CPU.Yreg = _CurrentPCB.Y;
            _CPU.Zflag = _CurrentPCB.Z;
        };
        return dispatcher;
    }());
    TSOS.dispatcher = dispatcher;
})(TSOS || (TSOS = {}));
