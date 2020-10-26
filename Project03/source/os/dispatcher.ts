module TSOS{

    export class dispatcher{

        public static save(): void{
            _CurrentPCB.PC = _CPU.PC;
            _CurrentPCB.Acc = _CPU.Acc;
            _CurrentPCB.X = _CPU.Xreg;
            _CurrentPCB.Y = _CPU.Yreg;
            _CurrentPCB.Z = _CPU.Zflag;
        }

        public static reload(): void{
            _CPU.PC = _CurrentPCB.PC;
            _CPU.Acc = _CurrentPCB.Acc;
            _CPU.Xreg = _CurrentPCB.X;
            _CPU.Yreg = _CurrentPCB.Y;
            _CPU.Zflag = _CurrentPCB.Z;
        }
    }
}