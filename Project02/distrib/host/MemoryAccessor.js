/*
Class Description Goes Here
*/
var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
        }
        MemoryAccessor.prototype.read = function (address) {
            return _Memory.memRange1[address];
        };
        /*
            This code writes the original user input into memory
            By iterating through every two numbers/letters in the user input and increase the memory storage spot by
            1 each time
        */
        MemoryAccessor.prototype.writeMem = function (data) {
            var opCodeCounter = 0;
            if (data.length / 2 <= 256) {
                for (var i = 0; i < data.length / 2; i++) {
                    _Memory.memRange1[i] = data.substring(opCodeCounter, opCodeCounter + 2);
                    opCodeCounter += 2;
                }
            }
        };
        /*
            This code will write to a specific spot in memory
        */
        MemoryAccessor.prototype.write = function (address, data) {
            _Memory.memRange1[address] = data;
        };
        /*
           Create a table and draw it to the screen
           The first two if statements create a new row for every 8 codes that are added
           For some reason it did not work when modulo and zero were put together
       */
        MemoryAccessor.prototype.writeMemtoScreen = function () {
            var memTable = "<table id=memory>";
            for (var i = 0; i < _Memory.memRange1.length; i++) {
                if (i == 0) {
                    memTable += "<tr><td>" + "0x" + ((i).toString(16).toUpperCase()).padStart(3, "0") + "</td>";
                }
                if (i % 8 === 0) {
                    if (i != 0) {
                        memTable += "<tr><td>" + "0x" + ((i).toString(16).toUpperCase()).padStart(3, "0") + "</td>";
                    }
                }
                memTable += "<td>" + _Memory.memRange1[i] + "</td>";
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
