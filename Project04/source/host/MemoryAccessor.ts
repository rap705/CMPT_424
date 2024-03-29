
module TSOS {
    export class MemoryAccessor{
        
        public read(address){
            if(_CurrentPCB.memSegment === 0){
                if(address >= 256){
                    address -= 256;
                    return _Memory.memRange[address];
                }
                else{
                    return _Memory.memRange[address];
                }
            }
            else if(_CurrentPCB.memSegment === 1){
                if(address >= 512){
                    address -= 256;
                    return _Memory.memRange[address];
                }
                else{
                    return _Memory.memRange[(address + 256)];
                }
            }
            else if(_CurrentPCB.memSegment === 2){
                if(address >= 768){
                    address -=256;
                    return _Memory.memRange[address];
                }
                else{
                    return _Memory.memRange[(address + 512)];
                }
            }
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
                    for(let i = 256; i < ((data.length / 2) +256); i++){
                        _Memory.memRange[i] = data.substring(opCodeCounter, opCodeCounter+2);
                        opCodeCounter += 2;
                    }
                }
                if(segment === 2){
                    for(let i = 512; i < ((data.length / 2) +512); i++){
                        _Memory.memRange[i] = data.substring(opCodeCounter, opCodeCounter+2);
                        opCodeCounter += 2;
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
            if(_CurrentPCB.memSegment === 0){
                if(address >= 256){
                    address -= 256;
                    _Memory.memRange[address] = data;
                }
                else{
                    _Memory.memRange[address] = data; 
                }
            }
            else if(_CurrentPCB.memSegment === 1){
                if(address >= 512){
                    address -= 256;
                    _Memory.memRange[address] = data;
                }
                else{
                    _Memory.memRange[(address + 256)] = data; 
                }
            }
            else if(_CurrentPCB.memSegment === 2){
                if(address >= 768){
                    address -= 256;
                    _Memory.memRange[address] = data;
                }
                else{
                    _Memory.memRange[(address + 512)] = data; 
                }
            }
            this.writeMemtoScreen();
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

        public clearMem(){
            for(let i=0; i<768; i++){
                _Memory.memRange[i] = "00";
            }
            this.writeMemtoScreen();
            this.updateProcessDis();
        }

        //This code will read all of the memory in a given segment
        public readAll(memSegment){
            let finalProcess = "";
            if(memSegment === 0){
                for(let i = 0; i < 255; i++){
                    finalProcess += _Memory.memRange[i]
                }
            }
            else if(memSegment === 1){
                for(let i = 256; i < 511; i++){
                    finalProcess += _Memory.memRange[i]
                }
            }
            else{
                for(let i = 512; i < 768; i++){
                    finalProcess += _Memory.memRange[i]
                }
            }
            return finalProcess;
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

        /*
        This code will update the Process Display by getting all processes currently in memory
        */
        public updateProcessDis(){
            let tableBody = document.getElementById("processBody");
            tableBody.innerHTML= "";
            for(let i=0; i < _CurrentStoredPCB.length; i++){
                let td = document.createElement("td");
                let tr = document.createElement("tr");
                td.innerHTML = _CurrentStoredPCB[i].PID.toString();
                tr.appendChild(td);
                td = document.createElement("td");
                td.innerHTML = _CurrentStoredPCB[i].PC;
                tr.appendChild(td);
                td = document.createElement("td");
                td.innerHTML = _CurrentStoredPCB[i].Acc;
                tr.appendChild(td);
                td = document.createElement("td");
                td.innerHTML = _CurrentStoredPCB[i].X;
                tr.appendChild(td);
                td = document.createElement("td");
                td.innerHTML = _CurrentStoredPCB[i].Y;
                tr.appendChild(td);
                td = document.createElement("td");
                td.innerHTML = _CurrentStoredPCB[i].Z;
                tr.appendChild(td);
                td = document.createElement("td");
                td.innerHTML = _CurrentStoredPCB[i].state;
                tr.appendChild(td);
                td = document.createElement("td");
                td.innerHTML = _CurrentStoredPCB[i].memSegment.toString();
                tr.appendChild(td);
                tableBody.appendChild(tr);
            }
        }
    }//End MemoryAccessor class
    
}//End TSOS module