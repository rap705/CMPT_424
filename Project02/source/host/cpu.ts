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

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }

        public execute(opCode){
            switch(opCode){
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
        }
        //Load the Accumulator with the next value
        public loadAcc(): void{
            this.Acc = parseInt(_MemoryAccessor.read(this.PC + 1), 16);
            this.PC += 2;
        }
        //Load the Accumulator with a value from memory
        public loadAccMem(): void{
            let location1 = parseInt(_MemoryAccessor.read(this.PC + 1), 16);
            let location2 = parseInt(_MemoryAccessor.read(this.PC + 2), 16);
            let newLocation = location1 + location2;
            this.Acc = parseInt(_MemoryAccessor.read(newLocation), 16);
            this.PC += 3;
        }

        //Store the Accumulator in memory
        public storeAccMem(): void{
            let location1 = parseInt(_MemoryAccessor.read(this.PC + 1), 16);
            let location2 = parseInt(_MemoryAccessor.read(this.PC + 2), 16);
            let newLocation = location1 + location2;
            //_MemoryAccessor.write();
        }

        //Add a value to the accumulator.  If its over 255 roll back to 0
        public addAcc(): void{
            let location1 = parseInt(_MemoryAccessor.read(this.PC + 1), 16);
            let location2 = parseInt(_MemoryAccessor.read(this.PC + 2), 16);
            let newLocation = location1 + location2;
            let addVal = parseInt(_MemoryAccessor.read(newLocation), 16);
            this.Acc += addVal;
            if(this.Acc >= 256){
                this.Acc %= 256;
            }
            this.PC += 3;
        }
    }
}
