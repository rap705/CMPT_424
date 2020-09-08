/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = /** @class */ (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            var _this = 
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            _super.call(this) || this;
            _this.driverEntry = _this.krnKbdDriverEntry;
            _this.isr = _this.krnKbdDispatchKeyPress;
            return _this;
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) {
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                }
                else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode >= 48) && (keyCode <= 57 && !isShifted)) { //Digits
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 32) || // space
                (keyCode == 13) || // Enter
                (keyCode == 8)) // Backspace
             {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 9) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 38) {
                chr = "up_arrow";
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 40) {
                chr = "down_arrow";
                _KernelInputQueue.enqueue(chr);
            }
            //Handles all symbols above numbers in order from 0-9
            else if ((keyCode >= 48) && (keyCode <= 57) && isShifted) {
                switch (keyCode) {
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
                    case 50: {
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
            else if ((keyCode == 188) && !isShifted) {
                chr = ",";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 188) && isShifted) {
                chr = "<";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 190) && !isShifted) {
                chr = ".";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 190) && isShifted) {
                chr = ">";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 191) && !isShifted) {
                chr = "/";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 191) && isShifted) {
                chr = "?";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 186) && !isShifted) {
                chr = ";";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 186) && isShifted) {
                chr = ":";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 222) && !isShifted) {
                chr = "'";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 222) && isShifted) {
                chr = '"';
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 219) && !isShifted) {
                chr = "[";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 219) && isShifted) {
                chr = "{";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 221) && !isShifted) {
                chr = "]";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 221) && isShifted) {
                chr = "}";
                _KernelInputQueue.enqueue(chr);
            }
            //TODO: Figure Out why typescript doesnt like "\"
            else if ((keyCode == 220) && !isShifted) {
                chr = String.fromCharCode(220);
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 220) && isShifted) {
                chr = "|";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 189) && !isShifted) {
                chr = "-";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 189) && isShifted) {
                chr = "_";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 187) && !isShifted) {
                chr = "=";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 187) && isShifted) {
                chr = "+";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 192) && !isShifted) {
                chr = "`";
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 192) && isShifted) {
                chr = "~";
                _KernelInputQueue.enqueue(chr);
            }
        };
        return DeviceDriverKeyboard;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
