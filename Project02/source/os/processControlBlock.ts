module TSOS{

    export class ProcessControlBlock{

        public pcbStatus;
        public pcbPriority;

        constructor(public PID : number){
            this.PID = PID;
            this.pcbStatus = "Ready"
            this.pcbPriority = 10;
        }
    }
}