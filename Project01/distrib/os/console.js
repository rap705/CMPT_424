/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = /** @class */ (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, optionList) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            if (optionList === void 0) { optionList = []; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.optionList = optionList;
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
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(8)) { //BackSpace
                    //Make sure there are characters in the buffer then delete the last one.
                    if (this.buffer.length > 0) {
                        this.backspace();
                    }
                }
                else if (chr === String.fromCharCode(9)) {
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
        Console.prototype.backspace = function () {
            var deletedChar = this.buffer.charAt(this.buffer.length - 1);
            var xFontSize = _DrawingContext.measureText(this.currentFont, this.currentFontSize, deletedChar);
            var yFontSize = _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin + this.currentFontSize + this.currentYPosition;
            this.currentXPosition -= xFontSize;
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize - _FontHeightMargin, xFontSize, yFontSize);
        };
        Console.prototype.clearLine = function () {
            var yFontSize = _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin + this.currentFontSize + this.currentYPosition;
            _DrawingContext.clearRect(12, this.currentYPosition - _DefaultFontSize - _FontHeightMargin, 488, yFontSize);
        };
        Console.prototype.tabList = function (text) {
            //Ensures that the user has enter a letter
            if (text.length > 0) {
                this.optionList = [];
                for (var i = 0; i < _OsShell.commandList.length; i++) {
                }
            }
        };
        Console.prototype.bsod = function () {
            _DrawingContext.style.backgroundColor = "blue";
        };
        return Console;
    }());
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
