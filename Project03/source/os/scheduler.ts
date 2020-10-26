module TSOS {
    export class scheduler{
        constructor(){

        }
        public static roundRobin(): void{
            let interrupt = new TSOS.Interrupt(SOFTWARE_IRQ, [0]);
            if(_CurrentStoredPCB.length >= 2){
                _Kernel.krnTrace("Context Switch with Round Robin");
                _KernelInterruptQueue.enqueue(interrupt);
            }
        }
    }//End scheduler class

}//End TSOS module