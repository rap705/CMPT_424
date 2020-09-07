/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "") {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        public clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        public resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
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
                else if(chr === String.fromCharCode(8)){ //BackSpace
                    //Make sure there are characters in the buffer then delete the last one.
                    if(this.buffer.length > 0){
                        this.backspace();
                    }
                }
                else if(chr === String.fromCharCode(9)){

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
        }

        public putText(text): void {
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
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            let changeValue = _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont , this.currentFontSize) + _FontHeightMargin;
            this.currentYPosition += changeValue;
             if(this.currentYPosition > _Canvas.height){
                 let snapshot = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);
                 this.clearScreen();
                 _DrawingContext.putImageData(snapshot, 0, -changeValue);
                 this.currentYPosition -= changeValue
             }
           /* this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;
             */
            // TODO: Handle scrolling. (iProject 1)
        }
        public backspace(): void {
            let deletedChar = this.buffer.charAt(this.buffer.length - 1);
            let xFontSize = _DrawingContext.measureText(this.currentFont, this.currentFontSize, deletedChar);
            let yFontSize = _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin  + this.currentFontSize + this.currentYPosition;
            this.currentXPosition -= xFontSize;
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize - _FontHeightMargin, xFontSize, yFontSize);
        }
        public bsod(){
            _DrawingContext.style.backgroundColor = "blue";
        }
    }
 }
