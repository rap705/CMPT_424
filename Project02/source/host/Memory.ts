/*
Class Description Goes Here
*/

module TSOS {
    export class Memory{
        constructor(public memRange1 = new Array(), public memAva1: boolean = true){
            this.memRange1 = memRange1;
            this.memAva1 = memAva1;
            //this.init();
        }
        public init(){
            for(let i=0; i<256; i++){
                this.memRange1[i] = "00";
            }
            this.memAva1 = true;
        }
    }//End Memory class

}//End TSOS module
