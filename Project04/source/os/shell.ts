/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc: ShellCommand;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data. Help");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help. Help");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            
            //Date 
            sc = new ShellCommand(this.shellDate, "date", "- Shows the currents date");
            this.commandList[this.commandList.length] = sc;
            
            //Where am I
            sc = new ShellCommand(this.shellWhereAmI, "whereami", "- Shows current location");
            this.commandList[this.commandList.length] = sc;

            //Coin flip
            sc = new ShellCommand(this.shellFlip, "flip" , "- Flip a coin");
            this.commandList[this.commandList.length] = sc;

            //Update Status
            sc = new ShellCommand(this.statusUpdate, "status", "<string> - Updates the Current Status");
            this.commandList[this.commandList.length] = sc;

            //Load OP codes into memory
            sc = new ShellCommand(this.shellLoad, "load", "- Checks to make sure all numbers are hex and loads them into memory");
            this.commandList[this.commandList.length] = sc;

            //Run an code from memory 
            sc = new ShellCommand(this.shellRun, "run", "<PID> - Runs the selected process");
            this.commandList[this.commandList.length] = sc;
            
            //Clear all memory partitions
            sc = new ShellCommand(this.shellClearMem, "clearmem", "- Clear all memory partitions");
            this.commandList[this.commandList.length] = sc;

            //Run all Processes
            sc = new ShellCommand(this.shellRunAll, "runall", "- Runs all current process in memory");
            this.commandList[this.commandList.length] = sc;

            //Displays the PID and state of all Processes
            sc = new ShellCommand(this.shellPS, "ps", "- Displays the PID and state of all Processes");
            this.commandList[this.commandList.length] = sc;

            //Kills the specified Process
            sc = new ShellCommand(this.shellKill, "kill", "<PID> - Kills the specified Process");
            this.commandList[this.commandList.length] = sc;

            //Kills all the currently running processes
            sc = new ShellCommand(this.shellKillAll, "killall", "- Kills all currently running processes");
            this.commandList[this.commandList.length] = sc;

            //Sets the quantum for Round Robin scheduling 
            sc = new ShellCommand(this.shellQuantum, "quantum", "<Int> - Sets the Quantum for Round Robin Scheduling");
            this.commandList[this.commandList.length] = sc;

            //Formats the disk drive
            sc = new ShellCommand(this.shellFormat, "format", "- Formats the disk for use");
            this.commandList[this.commandList.length] = sc;

            //Creates a file on the disk drive
            sc = new ShellCommand(this.shellCreateFile, "create", "<filename> - Creates a file with the given name");
            this.commandList[this.commandList.length] = sc;

            //Writes to a file on the disk drive
            sc = new ShellCommand(this.shellWriteFile, "write", "<filename> <data> - Writes data to the specified file");
            this.commandList[this.commandList.length] = sc;

            //Reads a file written on the disk
            sc = new ShellCommand(this.shellReadFile, "read", "<filename> - Read the specified file");
            this.commandList[this.commandList.length] = sc;
            
            //Deletes the specified file
            sc = new ShellCommand(this.shellDeleteFile, "delete", "<filename> - Delete the specified file");
            this.commandList[this.commandList.length] = sc;


            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer: string): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.

        public shellVer(args: string[]) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args: string[]) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls(args: string[]) {         
            _StdOut.clearScreen();     
            _StdOut.resetXY();
        }

        public shellMan(args: string[]) {
            if (args.length > 0) {
                var topic = args[0];
                //Allows for check to confirm command was found
                var trigger = false;
                for(let i = 0; i < _OsShell.commandList.length; i++){
                    //topic found
                    if(_OsShell.commandList[i].command === topic){
                        _StdIn.putText(_OsShell.commandList[i].command + ": " + _OsShell.commandList[i].description);
                        trigger = true;
                        break;
                    }
                }
                //Topic not found 
                if(!trigger){
                    _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } 
            //No topic supplied 
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        public shellDate(): void{
            let date = new Date();
            _StdOut.putText("Todays date is "+date);
        }
        public shellWhereAmI(): void{
            _StdOut.putText("How am I supposed to know if you don't!")
        }
        public shellFlip(): void{
            let randomNum = Math.random();
            if(randomNum > .5){
                _StdOut.putText("The coin fliped to heads.");
            }
            else{
                _StdOut.putText("The coin flipped to tails.")
            }
        }
        public statusUpdate( args: string[]): void{
            if(args.length > 0){
                var timeSet = <HTMLElement> document.getElementById("status");
                let statusString = args.toString();
                let re = /\,/g;
                let fixStatus = statusString.replace(re , " ");
                timeSet.innerText = fixStatus;
            }
        }
        public shellLoad(): void{
            let userInput = (<HTMLInputElement>document.getElementById("taProgramInput")).value;
            let valid = true;
            //Test to see if user input is captured
            //_StdOut.putText(userInput);
            userInput = Utils.trim(userInput);
            if(userInput === ""){
                _StdOut.putText("Invalid Hex");
                valid = false;
            }
            else{
                for(let i=0; i < userInput.length; i++){
                    switch(userInput.charAt(i)){
                        case " ":break;
                        case "A":break;
                        case "B":break;
                        case "C":break;
                        case "D":break;
                        case "E":break;
                        case "F":break;
                        case "1":break;
                        case "2":break;
                        case "3":break;
                        case "4":break;
                        case "5":break;
                        case "6":break;
                        case "7":break;
                        case "8":break;
                        case "9":break;
                        case "0":break;
                        case "\n":break;
                        default:
                            _StdOut.putText("Invalid Hex");
                            valid = false;
                    }
                }
            }
            if(valid){
                //_StdOut.putText("Valid Hex");
                let status = _MemoryManager.checkAvailabilty();
                if(_MemoryManager.checkAvailabilty()){
                    let pcb = new TSOS.ProcessControlBlock(_currentPID);

                    _PCBCon[_PCBCon.length] = pcb;

                    _StdOut.putText("Memory Available");
                    _StdOut.advanceLine();
                    _StdOut.putText("PID: " + _currentPID);
                    _currentPID ++;

                    //Get the available memory segment and save it in the PCB
                   pcb.memSegment = _MemoryManager.getAvailableMem();

                   //Based off the memory Segment determine the base and limit
                   if(pcb.memSegment === 0){
                       pcb.base = 0;
                       pcb.limit = 255;
                   }
                   else if(pcb.memSegment === 0){
                        pcb.base = 256;
                        pcb.limit = 511;
                    }
                    else{
                        pcb.base = 512;
                        pcb.limit = 768;
                    }

                   //Flip the memory segment to be no longer available
                   _MemoryManager.changeAvailabilityStatus(pcb.memSegment);

                   //Add the PCB to the Current Stored PCB Container
                   _CurrentStoredPCB[pcb.memSegment] = pcb;
                    
                   //This replaces all spaces with nothing to get the input into the proper format
                    userInput = userInput.replace(/\s/g, "");

                    //Write the program to memory 
                    _MemoryAccessor.writeMem(userInput, pcb.memSegment);

                    //Print the program in memory on the screen 
                    _MemoryAccessor.writeMemtoScreen();

                    //Print the Process to screen
                    _MemoryAccessor.updateProcessDis();
                }
                else{
                    _StdOut.putText("No memory available")
                }
            }
        }

        //This will run only the specified process 
        public shellRun(args: string){
            if(args.length > 0){
                let pid = parseInt(args);
               if(_CurrentStoredPCB[pid]){ 
                    _CPU.init();
                    _CPU.isExecuting = true;
                    _CurrentPCB = _PCBCon[pid];
                    _Running++;
               }
               else{
                   _StdOut.putText("Not a valid PID");
               }
                
            }
        }

        //Clears ALL memory partitions
        public shellClearMem(): void{
            _MemoryAccessor.clearMem();
        }

        //Runs all current processes in memory
        public shellRunAll(args: string){
            if(_CurrentStoredPCB.length >= 1){
                _CPU.init();
                _CPU.isExecuting = true;
                _CurrentPCB = _CurrentStoredPCB[0];
                _Running = _CurrentStoredPCB.length;
            }
        }

        //Displays the PID and state of all processes
        public shellPS(args: string){
            for(let i = 0; i < _CurrentStoredPCB.length; i++){
                let pid = _CurrentStoredPCB[i].PID.toString();
                _StdOut.putText("PID: " + pid);
                let state = _CurrentStoredPCB[i].state.toString();
                _StdOut.putText("  State: " + state);
                _StdOut.advanceLine();
            }
        }

        //Kills the specificed Process
        public shellKill(args: string){
            
        }

        //Kills all currently running Processes
        public shellKillAll(args: string){
            _Running = 0;
        }

        //Sets the Round Robin Quantum 
        public shellQuantum(args: string){
            let quantum = parseInt(args);
            _Quantum = quantum;
            _StdOut.putText("Quantum set to "+_Quantum);
            _StdOut.advanceLine();
        }

        //Formats the Disk Drive
        public shellFormat(){
            if(!_CPU.isExecuting){
                _krnFileSystemDriver.formatDrive();
            }
        }

        //Create a file on the disk with the given name
        public shellCreateFile(args: string){
            if(_krnFileSystemDriver.status !== "formatted"){
                _StdOut.putText("The disk is not formatted. Format the disk to create a file.");
            }
            else{
                if(args.length > 0){
                    _krnFileSystemDriver.createFile(args);
                }
                else{
                    _StdOut.putText("No file name provided. Please supply a file name.")
                }
            }
        }

        public shellWriteFile(args: string){
            if(_krnFileSystemDriver.status !== "formatted"){
                _StdOut.putText("The disk is not formatted. Format the disk to create a file.");
            }
            else{
                if(args.length > 1){
                    let data = "";
                    for(let i = 1; i < args.length; i++){
                        data += args[i] + " ";
                    }
                    data = data.substring(0 , data.length-1);
                    _krnFileSystemDriver.writeFile(args[0], data);
                }
                else{
                    _StdOut.putText("Filename and data in quotes must be provided.")
                }
            }
        }

        //This will print the data in the file to the console
        public shellReadFile(args: string){
            if(_krnFileSystemDriver.status !== "formatted"){
                _StdOut.putText("The disk is not formatted. Format the disk to create a file.");
            }
            else{
                if(args.length > 0){
                    _krnFileSystemDriver.readFile(args[0]);
                }
            }
        }

        //This will delete the specified file
        public shellDeleteFile(args: string){
            if(_krnFileSystemDriver.status !== "formatted"){
                _StdOut.putText("The disk is not formatted. Format the disk to create a file.");
            }
            else{
                if(args.length > 0){
                    _krnFileSystemDriver.deleteFile(args[0]);
                }
            }
        }

        //This will list all files on the disk
        public shellListFiles(){
            
        }


        //This will eventually give the blue screen of death maybe
        public bsod(): void{
            
        }

    }
}
