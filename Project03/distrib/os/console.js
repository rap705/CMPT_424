/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = /** @class */ (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, optionList, commandCounter, commandList) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            if (optionList === void 0) { optionList = []; }
            if (commandCounter === void 0) { commandCounter = 0; }
            if (commandList === void 0) { commandList = []; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.optionList = optionList;
            this.commandCounter = commandCounter;
            this.commandList = commandList;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.commandList[this.commandList.length] = this.buffer;
                    this.commandCounter++;
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(8)) { //BackSpace
                    //Make sure there are characters in the buffer then delete the last one.
                    if (this.buffer.length > 0) {
                        this.backspace();
                    }
                }
                else if (chr === String.fromCharCode(9)) {
                    this.tabList();
                }
                else if (chr === "up_arrow") {
                    this.upArrow();
                }
                else if (chr === "down_arrow") {
                    this.downArrow();
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        };
        Console.prototype.putText = function (text) {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            var changeValue = _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin;
            this.currentYPosition += changeValue;
            if (this.currentYPosition > _Canvas.height) {
                var snapshot = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);
                this.clearScreen();
                _DrawingContext.putImageData(snapshot, 0, -changeValue);
                this.currentYPosition -= changeValue;
            }
            /* this.currentYPosition += _DefaultFontSize +
                                      _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                      _FontHeightMargin;
              */
            // TODO: Handle scrolling. (iProject 1)
        };
        //TODO: Stop backspace from deleting line arrow
        Console.prototype.backspace = function () {
            var deletedChar = this.buffer.charAt(this.buffer.length - 1);
            var xFontSize = _DrawingContext.measureText(this.currentFont, this.currentFontSize, deletedChar);
            var yFontSize = _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin + this.currentFontSize + this.currentYPosition;
            this.currentXPosition -= xFontSize;
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize - _FontHeightMargin, xFontSize, yFontSize);
            this.buffer = this.buffer.slice(0, this.buffer.length - 1);
        };
        Console.prototype.clearLine = function () {
            var yFontSize = _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin + this.currentFontSize + this.currentYPosition;
            //The canvas size is 500p and the arrow is about 12p
            _DrawingContext.clearRect(12, this.currentYPosition - _DefaultFontSize - _FontHeightMargin, 488, yFontSize);
            this.currentXPosition = 12;
        };
        Console.prototype.tabList = function () {
            var finalCommand = [];
            var prevVal = true;
            var bufferVal = this.buffer.length;
            //Ensures that the user has enter a letter
            if (bufferVal > 0) {
                this.optionList = _OsShell.commandList;
                for (var _i = 0, _a = this.optionList; _i < _a.length; _i++) {
                    var sc = _a[_i];
                    prevVal = true;
                    for (var i = 0; i < bufferVal; i++) {
                        if ((sc.command[i] === this.buffer[i]) && prevVal) {
                            if ((bufferVal - 1 === i) && prevVal) {
                                finalCommand[finalCommand.length] = sc;
                            }
                        }
                        else {
                            prevVal = false;
                        }
                    }
                }
                if (finalCommand.length === 1) {
                    this.clearLine();
                    this.putText(finalCommand[0].command);
                    this.buffer = finalCommand[0].command;
                }
            }
        };
        Console.prototype.upArrow = function () {
            this.clearLine();
            this.commandCounter--;
            this.putText(this.commandList[this.commandCounter]);
            this.buffer = this.commandList[this.commandCounter];
        };
        Console.prototype.downArrow = function () {
            this.clearLine();
            this.commandCounter++;
            this.putText(this.commandList[this.commandCounter]);
            this.buffer = this.commandList[this.commandCounter];
        };
        Console.prototype.bsod = function () {
            _DrawingContext.style.backgroundColor = "blue";
        };
        return Console;
    }());
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
