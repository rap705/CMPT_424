/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = /** @class */ (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //this.execute();
        };
        Cpu.prototype.execute = function (opCode) {
            switch (opCode) {
                case "A9":
                    break;
                case "AD":
                    break;
                case "8D":
                    break;
                case "6D":
                    break;
                case "A2":
                    break;
                case "AE":
                    break;
                case "A0":
                    break;
                case "AC":
                    break;
                case "EA":
                    break;
                case "00":
                    break;
                case "EC":
                    break;
                case "D0":
                    break;
                case "EE":
                    break;
                case "FF":
                    break;
            }
        };
        //Load the Accumulator with the next value
        Cpu.prototype.loadAcc = function () {
            this.Acc = parseInt(_MemoryAccessor.read(this.PC + 1), 16);
            this.PC += 2;
        };
        //Load the Accumulator with a value from memory
        Cpu.prototype.loadAccMem = function () {
            var location1 = parseInt(_MemoryAccessor.read(this.PC + 1), 16);
            var location2 = parseInt(_MemoryAccessor.read(this.PC + 2), 16);
            var newLocation = location1 + location2;
            this.Acc = parseInt(_MemoryAccessor.read(newLocation), 16);
            this.PC += 3;
        };
        //Store the Accumulator in memory
        Cpu.prototype.storeAccMem = function () {
            var location1 = parseInt(_MemoryAccessor.read(this.PC + 1), 16);
            var location2 = parseInt(_MemoryAccessor.read(this.PC + 2), 16);
            var newLocation = location1 + location2;
            //_MemoryAccessor.write();
        };
        //Add a value to the accumulator.  If its over 255 roll back to 0
        Cpu.prototype.addAcc = function () {
            var location1 = parseInt(_MemoryAccessor.read(this.PC + 1), 16);
            var location2 = parseInt(_MemoryAccessor.read(this.PC + 2), 16);
            var newLocation = location1 + location2;
            var addVal = parseInt(_MemoryAccessor.read(newLocation), 16);
            this.Acc += addVal;
            if (this.Acc >= 256) {
                this.Acc %= 256;
            }
            this.PC += 3;
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
