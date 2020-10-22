module TSOS{
    export class MemoryManager{
        constructor(){

        }
        public checkAvailabilty(): boolean{
            if(_Memory.memAva1){
                return _Memory.memAva1;
            }
            else{
                return false;
            }
        }
        public changeAvailabiltyStatus(): void{
            if(_Memory.memAva1){
                _Memory.memAva1 = false;
            }
            else{
                _Memory.memAva1 = true;
            }
        }

    }
}