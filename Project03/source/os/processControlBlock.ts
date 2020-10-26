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
            this.Acc = 0;
            this.X = 0;
            this.Y = 0;
            this.Z = 0;
            this.state = "Resident";
        }
    }
}