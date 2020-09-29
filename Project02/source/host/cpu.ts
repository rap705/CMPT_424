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
            this.execute(this.isExecuting);
        }

        public execute(check){
            if(check){
                let opCode = _MemoryAccessor.read(this.PC);
                switch(opCode){
                    case "A9":
                        this.loadAcc();
                        break;
                    case "AD":
                        this.loadAccMem();
                        break;
                    case "8D":
                        this.storeAccMem();
                        break;
                    case "6D":
                        this.addAcc();
                        break;
                    case "A2":
                        this.loadXRegCon();
                        break;
                    case "AE":
                        this.loadXRegMem();
                        break;
                    case "A0":
                        this.loadYRegCon();
                        break;
                    case "AC":
                        this.loadYRegMem();
                        break;
                    case "EA":
                        break;
                    case "00":
                        this.break();
                        break;
                    case "EC":
                        this.compareByte();
                        break;
                    case "D0":
                        this.branch();
                        break;
                    case "EE":
                        this.increment();
                        break;
                    case "FF":
                        let interrupt = new TSOS.Interrupt(SYSTEM_CALL, [0]);
                        _KernelInterruptQueue.enqueue(interrupt);
                        break;
                }
                _MemoryAccessor.updateCPUDis(opCode);
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
            this.Acc = parseInt(_MemoryAccessor.read(location1), 16);
            this.PC += 3;
        }

        //Store the Accumulator in memory
        public storeAccMem(): void{
            let location1 = parseInt(_MemoryAccessor.read(this.PC + 1), 16);
            _MemoryAccessor.write(location1, this.Acc);
            this.PC += 3;
        }

        //Add a value to the accumulator value.  If its over 255 roll back to 0
        public addAcc(): void{
            let location1 = parseInt(_MemoryAccessor.read(this.PC + 1), 16);
            let addVal = parseInt(_MemoryAccessor.read(location1), 16);
            this.Acc += addVal;
            if(this.Acc >= 256){
                this.Acc %= 256;
            }
            this.PC += 3;
        }
        
        //Load the X-Reg with a constant
        public loadXRegCon(): void{
            this.Xreg = parseInt(_MemoryAccessor.read(this.PC+1), 16);
            this.PC += 2;
        }

        //Load the X-Reg from memory
        public loadXRegMem(): void{
            let location1 = parseInt(_MemoryAccessor.read(this.PC+1), 16);
            this.Xreg = parseInt(_MemoryAccessor.read(location1));
            this.PC += 3;
        }

        //Load the Y-Reg with a constant
        public loadYRegCon(): void{
            this.Yreg = parseInt(_MemoryAccessor.read(this.PC+1), 16);
            this.PC += 2;
        }

        //Load the Y-Reg from memory
        public loadYRegMem(): void{
            let location1 = parseInt(_MemoryAccessor.read(this.PC+1), 16);
            this.Yreg = parseInt(_MemoryAccessor.read(location1));
            this.PC += 3;
        }

        //Break(which is really just a system call)
        public break(): void{
            this.isExecuting = false;
        }

        //Compare a byte in memory to the X-Reg
        public compareByte(): void{
            var location1 = parseInt(_MemoryAccessor.read(this.PC+1), 16);
            var compValue = parseInt(_MemoryAccessor.read(location1), 16);
            if(this.Xreg == compValue){
                this.Zflag = 1;
            }
            else{
                this.Zflag = 0;
            }
            this.PC += 3;
        }

        //Branch
        public branch(): void{
            if(this.Zflag === 0){
                var jump = parseInt(_MemoryAccessor.read(this.PC+1), 16);
                //This accounts for the bytes we have already been through 
                this.PC += 2;
                this.PC += jump;
                this.PC %= 256;
            }
            else{
                this.PC+= 2;
            }
        }

        //Increment the value of a byte
        public increment(): void{
            var location1 = parseInt(_MemoryAccessor.read(this.PC+1), 16);
            var value = parseInt(_MemoryAccessor.read(location1), 16);
            value++;
            _MemoryAccessor.write(location1, value.toString(16));
            this.PC += 3;
        }
    }
}
