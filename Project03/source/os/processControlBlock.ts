module TSOS{

    export class ProcessControlBlock{

        public pcbStatus;
        public pcbPriority;
        public memSegment;
        public PC;

        constructor(public PID : number){
            this.PID = PID;
            this.pcbStatus = "Ready"
            this.pcbPriority = 10;
            this.memSegment;
            this.PC = 0;
        }
    }
}