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
        return MemoryAccessor;
    }()); //End MemoryAccessor class
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {})); //End TSOS module
