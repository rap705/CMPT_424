module TSOS{

    export class ProcessControlBlock{

        public pcbPriority;
        public memSegment;
        public PC;
        public IR;
        public Acc;
        public X;
        public Y;
        public Z;
        public state;


        constructor(public PID : number){
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
    }
}