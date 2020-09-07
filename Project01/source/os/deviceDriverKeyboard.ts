/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) { 
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                } else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } 
            else if ((keyCode >= 48) && (keyCode <= 57 && !isShifted)){//Digits
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            } 
            else if(            
                        (keyCode == 32)                     ||   // space
                        (keyCode == 13)                     ||   // Enter
                        (keyCode == 8))                       // Backspace
                        {                       
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if(keyCode == 9){
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if(keyCode == 38){
                chr = "up_arrow";
                _KernelInputQueue.enqueue(chr);
            }
            else if(keyCode == 40){
                chr = "down_arrow";
                _KernelInputQueue.enqueue(chr);
            }
            //Handles all symbols above numbers in order from 0-9
            else if ((keyCode >= 48) && (keyCode <= 57) && isShifted){
                    switch(keyCode){
                        case 48: {
                            chr = String.fromCharCode(41);
                            _KernelInputQueue.enqueue(chr);
                            break;
                        }
                        case 49: {
                            chr = String.fromCharCode(33);
                            _KernelInputQueue.enqueue(chr);
                            break;
                        }
                        case 50:{
                            chr = String.fromCharCode(64);
                            _KernelInputQueue.enqueue(chr);
                            break;
                        }
                        case 51: {
                            chr = String.fromCharCode(35);
                            _KernelInputQueue.enqueue(chr);
                            break;
                        }
                        case 52: {
                            chr = String.fromCharCode(36);
                            _KernelInputQueue.enqueue(chr);
                            break;
                        }
                        case 53: {
                            chr = String.fromCharCode(37);
                            _KernelInputQueue.enqueue(chr);
                            break;
                        }
                        case 54: {
                            chr = String.fromCharCode(94);
                            _KernelInputQueue.enqueue(chr);
                            break;
                        }
                        case 55: {
                            chr = "&";
                            _KernelInputQueue.enqueue(chr);
                            break;
                        }
                        case 56: {
                            chr = String.fromCharCode(42);
                            _KernelInputQueue.enqueue(chr);
                            break;
                        }
                        case 57: {
                            chr = "(";
                            _KernelInputQueue.enqueue(chr);
                            break;
                        }
                    }
            }
            else if((keyCode == 188) && !isShifted){
                chr = ",";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 188) && isShifted){
                chr = "<";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 190) && !isShifted){
                chr = ".";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 190) && isShifted){
                chr = ">";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 191) && !isShifted){
                chr = "/";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 191) && isShifted){
                chr = "?";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 186) && !isShifted){
                chr = ";";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 186) && isShifted){
                chr = ":";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 222) && !isShifted){
                chr = "'";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 222) && isShifted){
                chr = '"';
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 219) && !isShifted){
                chr = "[";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 219) && isShifted){
                chr = "{";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 221) && !isShifted){
                chr = "]";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 221) && isShifted){
                chr = "}";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 220) && !isShifted){
                chr = String.fromCharCode(220);
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 220) && isShifted){
                chr = "|";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 189) && !isShifted){
                chr = "-";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 189) && isShifted){
                chr = "_";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 187) && !isShifted){
                chr = "=";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 187) && isShifted){
                chr = "+";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 192) && !isShifted){
                chr = "`";
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode == 192) && isShifted){
                chr = "~";
                _KernelInputQueue.enqueue(chr);
            }
        }
    }
}
