/*
Class Description Goes Here
*/

module TSOS {
    export class MemoryAccessor{
        
        public read(address){
            return _Memory.memRange1[address];
        }
    }//End MemoryAccessor class
    
}//End TSOS module