/* --------
   Utils.ts

   Utility functions.
   -------- */

module TSOS {

    export class Utils {

        public static trim(str): string {
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
        }

        public static rot13(str: string): string {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal: string = "";
            for (var i in <any>str) {    // We need to cast the string to any for use in the for...in construct.
                var ch: string = str[i];
                var code: number = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                } else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) - 13;  // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                } else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        }

        //This will initialize the disk display so it can be easily modified later using ids
        public static initDiskTable(){
            let body = document.getElementById("diskBody");
            for(let i = 0; i < 4; i++){
                for(let k = 0; k < 8; k++){
                    for(let j = 0; j < 8; j++){
                        let key = _krnFileSystemDriver.getKey(i, k, j);
                        let row = document.createElement("tr");
                        row.id = "Row"+i+k+j;
                        let column = document.createElement("td");
                        column.id = "Key"+i+k+j;
                        let parseKey = _krnFileSystemDriver.parseKey(key);
                        column.innerHTML = parseKey.i + ":" + parseKey.k + ":" + parseKey.j;
                        row.appendChild(column);
                        column = document.createElement("td");
                        column.id = "Use"+i+k+j;
                        row.appendChild(column);
                        column = document.createElement("td");
                        column.id = "Next"+i+k+j;
                        row.appendChild(column);
                        column = document.createElement("td");
                        column.id = "Data"+i+k+j;
                        row.appendChild(column);
                        body.appendChild(row);
                    }
                }
            }
        }

        //Update a specific row in the disk display
        public static updateDiskRow(key){
            let parseKey = _krnFileSystemDriver.parseKey(key);
            let block = sessionStorage.getItem(key);
            let use = document.getElementById("Use"+parseKey.i+parseKey.k+parseKey.j);
            let inUse = _krnFileSystemDriver.blockFree(block);
            if(inUse){
                use.innerHTML= "0";
            }
            else{
                use.innerHTML= "1";
            }
            let next = document.getElementById("Next"+parseKey.i+parseKey.k+parseKey.j);
            let blockPointer = _krnFileSystemDriver.getBlockPointer(block);
            let parsePointer = _krnFileSystemDriver.parseKey(blockPointer);
            next.innerHTML = parsePointer.i + parsePointer.k + parsePointer.j;
            let data = document.getElementById("Data"+parseKey.i+parseKey.k+parseKey.j);
            data.innerHTML = _krnFileSystemDriver.getBlockDataRaw(block);
        }

    }
}
