
module TSOS {
    export class Memory{
        constructor(public memRange = new Array(), public memAva1: boolean = true, public memAva2: boolean = true, public memAva3: boolean = true){
            this.memRange = memRange;
            this.memAva1 = memAva1;
            this.memAva2 = memAva2;
            this.memAva3 = memAva3;
            //this.init();
        }
        public init(){
            for(let i=0; i<768; i++){
                this.memRange[i] = "00";
            }
            this.memAva1 = true;
        }
    }//End Memory class

}//End TSOS module
