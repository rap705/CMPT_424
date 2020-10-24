var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
        }
        MemoryAccessor.prototype.read = function (address) {
            if (_CurrentPCB.memSegment === 0) {
                if (address >= 256) {
                    address -= 256;
                    return _Memory.memRange[address];
                }
                else {
                    return _Memory.memRange[address];
                }
            }
            else if (_CurrentPCB.memSegment === 1) {
                if (address >= 512) {
                    address -= 256;
                    return _Memory.memRange[address];
                }
                else {
                    return _Memory.memRange[(address + 256)];
                }
            }
            else if (_CurrentPCB.memSegment === 2) {
                if (address >= 768) {
                    address -= 256;
                    return _Memory.memRange[address];
                }
                else {
                    return _Memory.memRange[(address + 512)];
                }
            }
        };
        /*
            This code writes the original user input into memory
            By iterating through every two numbers/letters in the user input and increase the memory storage spot by
            1 each time
        */
        MemoryAccessor.prototype.writeMem = function (data, segment) {
            var opCodeCounter = 0;
            if (data.length / 2 <= 256) {
                if (segment === 0) {
                    for (var i = 0; i < data.length / 2; i++) {
                        _Memory.memRange[i] = data.substring(opCodeCounter, opCodeCounter + 2);
                        opCodeCounter += 2;
                    }
                }
                if (segment === 1) {
                    for (var i = 256; i < ((data.length / 2) + 256); i++) {
                        _Memory.memRange[i] = data.substring(opCodeCounter, opCodeCounter + 2);
                        opCodeCounter += 2;
                    }
                }
                if (segment === 2) {
                    for (var i = 512; i < ((data.length / 2) + 512); i++) {
                        _Memory.memRange[i] = data.substring(opCodeCounter, opCodeCounter + 2);
                        opCodeCounter += 2;
                    }
                }
            }
            else {
                _StdOut.putText("Process is to large. Failed to Store in Memory");
            }
        };
        /*
            This code will write to a specific spot in memory
        */
        MemoryAccessor.prototype.write = function (address, data) {
            if (_CurrentPCB.memSegment === 0) {
                if (address >= 256) {
                    address -= 256;
                    _Memory.memRange[address] = data;
                }
                else {
                    _Memory.memRange[address] = data;
                }
            }
            else if (_CurrentPCB.memSegment === 1) {
                if (address >= 512) {
                    address -= 256;
                    _Memory.memRange[address] = data;
                }
                else {
                    _Memory.memRange[(address + 256)] = data;
                }
            }
            else if (_CurrentPCB.memSegment === 2) {
                if (address >= 768) {
                    address -= 256;
                    _Memory.memRange[address] = data;
                }
                else {
                    _Memory.memRange[(address + 512)] = data;
                }
            }
        };
        /*
           Create a table and draw it to the screen
           The first two if statements create a new row for every 8 codes that are added
           For some reason it did not work when modulo and zero were put together
       */
        MemoryAccessor.prototype.writeMemtoScreen = function () {
            var memTable = "<table id=memory>";
            for (var i = 0; i < _Memory.memRange.length; i++) {
                if (i == 0) {
                    memTable += "<tr><td>" + "0x" + ((i).toString(16).toUpperCase()).padStart(3, "0") + "</td>";
                }
                if (i % 8 === 0) {
                    if (i != 0) {
                        memTable += "<tr><td>" + "0x" + ((i).toString(16).toUpperCase()).padStart(3, "0") + "</td>";
                    }
                }
                memTable += "<td>" + _Memory.memRange[i] + "</td>";
            }
            document.getElementById("divMemTable").innerHTML = memTable;
        };
        /*
            This code updates the CPU display
            I was not sure which class to put this code in and will probably move it to
            a better location later.
        */
        MemoryAccessor.prototype.updateCPUDis = function (opCode) {
            document.getElementById("PC").innerHTML = _CPU.PC.toString();
            document.getElementById("IR").innerHTML = opCode.toString();
            document.getElementById("Acc").innerHTML = _CPU.Acc.toString();
            document.getElementById("XReg").innerHTML = _CPU.Xreg.toString();
            document.getElementById("YReg").innerHTML = _CPU.Yreg.toString();
            document.getElementById("ZFlag").innerHTML = _CPU.Zflag.toString();
        };
        return MemoryAccessor;
    }()); //End MemoryAccessor class
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {})); //End TSOS module
