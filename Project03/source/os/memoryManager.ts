module TSOS{
    export class MemoryManager{
        constructor(){

        }

        //This checks to make sure that there is memory available and returns true if there is
        public checkAvailabilty(): boolean{
            if(_Memory.memAva1){
                return _Memory.memAva1;
            }
            else if(_Memory.memAva2){
                return _Memory.memAva2;
            }
            else if(_Memory.memAva3){
                return _Memory.memAva3;
            }
            else{
                return false;
            }
        }

        //This will change the status of the specified memory segment
        public changeAvailabilityStatus(segment): void{
            if(segment === 0){
                if(_Memory.memAva1){
                    _Memory.memAva1 = false;
                }
                else{
                    _Memory.memAva1 = true;
                }
            }
            else if(segment === 1){
                if(_Memory.memAva2){
                    _Memory.memAva2 = false;
                }
                else{
                    _Memory.memAva2 = true;
                }
            }
            else if(segment === 2){
                if(_Memory.memAva3){
                    _Memory.memAva3 = false;
                }
                else{
                    _Memory.memAva3 = true;
                }
            }
        }

        public getAvailableMem(): number{
            if(_Memory.memAva1){
                return 0;
            }
            else if(_Memory.memAva2){
                return 1;
            }
            else if(_Memory.memAva3){
                return 2;
            }
        }

    }
}