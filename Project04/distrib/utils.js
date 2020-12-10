/* --------
   Utils.ts

   Utility functions.
   -------- */
var TSOS;
(function (TSOS) {
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        Utils.trim = function (str) {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
            Huh? WTF? Okay... take a breath. Here we go:
            - The "|" separates this into two expressions, as in A or B.
            - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
            - "\s+$" is the same thing, but at the end of the string.
            - "g" makes is global, so we get all the whitespace.
            - "" is nothing, which is what we replace the whitespace with.
            */
        };
        Utils.rot13 = function (str) {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal = "";
            for (var i in str) { // We need to cast the string to any for use in the for...in construct.
                var ch = str[i];
                var code = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) + 13; // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                }
                else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) - 13; // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                }
                else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        };
        //This will initialize the disk display so it can be easily modified later using ids
        Utils.initDiskTable = function () {
            var body = document.getElementById("diskBody");
            for (var i = 0; i < 4; i++) {
                for (var k = 0; k < 8; k++) {
                    for (var j = 0; j < 8; j++) {
                        var key = _krnFileSystemDriver.getKey(i, k, j);
                        var row = document.createElement("tr");
                        row.id = "Row" + i + k + j;
                        var column = document.createElement("td");
                        column.id = "Key" + i + k + j;
                        var parseKey = _krnFileSystemDriver.parseKey(key);
                        column.innerHTML = parseKey.i + ":" + parseKey.k + ":" + parseKey.j;
                        row.appendChild(column);
                        column = document.createElement("td");
                        column.id = "Use" + i + k + j;
                        row.appendChild(column);
                        column = document.createElement("td");
                        column.id = "Next" + i + k + j;
                        row.appendChild(column);
                        column = document.createElement("td");
                        column.id = "Data" + i + k + j;
                        row.appendChild(column);
                        body.appendChild(row);
                    }
                }
            }
        };
        //Update a specific row in the disk display
        Utils.updateDiskRow = function (key) {
            var parseKey = _krnFileSystemDriver.parseKey(key);
            var block = sessionStorage.getItem(key);
            var use = document.getElementById("Use" + parseKey.i + parseKey.k + parseKey.j);
            var inUse = _krnFileSystemDriver.blockFree(block);
            if (inUse) {
                use.innerHTML = "0";
            }
            else {
                use.innerHTML = "1";
            }
            var next = document.getElementById("Next" + parseKey.i + parseKey.k + parseKey.j);
            var blockPointer = _krnFileSystemDriver.getBlockPointer(block);
            var parsePointer = _krnFileSystemDriver.parseKey(blockPointer);
            next.innerHTML = parsePointer.i + parsePointer.k + parsePointer.j;
            var data = document.getElementById("Data" + parseKey.i + parseKey.k + parseKey.j);
            data.innerHTML = _krnFileSystemDriver.getBlockDataRaw(block);
        };
        return Utils;
    }());
    TSOS.Utils = Utils;
})(TSOS || (TSOS = {}));
