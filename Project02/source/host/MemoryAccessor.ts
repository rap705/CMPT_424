/*
Class Description Goes Here
*/

module TSOS {
    export class MemoryAccessor{
        
        public read(address){
            return _Memory.memRange1[address];
        }

        public writeMem(data): void{
            let opCodeCounter = 0;
            if(data.length / 2 <= 256){
                for(let i = 0; i < data.length / 2; i++){
                    _Memory.memRange1[i] = data.substring(opCodeCounter, opCodeCounter+2);
                    opCodeCounter += 2;
                }
            }
        }
    }//End MemoryAccessor class
    
}//End TSOS module