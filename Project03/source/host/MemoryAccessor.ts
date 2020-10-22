
module TSOS {
    export class MemoryAccessor{
        
        public read(address){
            return _Memory.memRange[address];
        }
        /*
            This code writes the original user input into memory
            By iterating through every two numbers/letters in the user input and increase the memory storage spot by 
            1 each time
        */
        public writeMem(data, segment): void{
            let opCodeCounter = 0;
            if(data.length / 2 <= 256){
                if(segment === 0){
                    for(let i = 0; i < data.length / 2; i++){
                        _Memory.memRange[i] = data.substring(opCodeCounter, opCodeCounter+2);
                        opCodeCounter += 2;
                    }
                }
                if(segment === 1){
                    for(let i = 256; i < (data.length+256); i++){
                        _Memory.memRange[i] = data.substring(opCodeCounter, opCodeCounter+2);
                        opCodeCounter += 2;
                        i++;
                    }
                }
                if(segment === 2){
                    for(let i = 512; i < (data.length+512); i++){
                        _Memory.memRange[i] = data.substring(opCodeCounter, opCodeCounter+2);
                        opCodeCounter += 2;
                        i++;
                    }
                }
            }
            else{
                _StdOut.putText("Process is to large. Failed to Store in Memory")
            }
        }
        /*
            This code will write to a specific spot in memory
        */
        public write(address, data): void{
            _Memory.memRange[address] = data;
        }
         /*
            Create a table and draw it to the screen 
            The first two if statements create a new row for every 8 codes that are added
            For some reason it did not work when modulo and zero were put together
        */
        public writeMemtoScreen(){
            let memTable = "<table id=memory>";
                for(let i = 0; i < _Memory.memRange.length; i++){
                    if(i == 0){
                        memTable += "<tr><td>" + "0x" + ((i).toString(16).toUpperCase()).padStart(3 , "0") + "</td>";
                    }
                    if(i % 8 === 0){
                        if(i != 0){
                            memTable += "<tr><td>" + "0x" + ((i).toString(16).toUpperCase()).padStart(3 , "0") + "</td>";
                        }
                    }
                    memTable += "<td>" + _Memory.memRange[i] + "</td>";
                }
                document.getElementById("divMemTable").innerHTML= memTable;
        }
        /*
            This code updates the CPU display
            I was not sure which class to put this code in and will probably move it to 
            a better location later.
        */
        public updateCPUDis(opCode){
            document.getElementById("PC").innerHTML = _CPU.PC.toString();
            document.getElementById("IR").innerHTML = opCode.toString();
            document.getElementById("Acc").innerHTML = _CPU.Acc.toString();
            document.getElementById("XReg").innerHTML = _CPU.Xreg.toString();
            document.getElementById("YReg").innerHTML = _CPU.Yreg.toString();
            document.getElementById("ZFlag").innerHTML = _CPU.Zflag.toString();
        }
    }//End MemoryAccessor class
    
}//End TSOS module