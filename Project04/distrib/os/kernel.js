/* ------------
     Kernel.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Kernel = /** @class */ (function () {
        function Kernel() {
        }
        //
        // OS Startup and Shutdown Routines
        //
        Kernel.prototype.krnBootstrap = function () {
            TSOS.Control.hostLog("bootstrap", "host"); // Use hostLog because we ALWAYS want this, even if _Trace is off.
            // Initialize our global queues.
            _KernelInterruptQueue = new TSOS.Queue(); // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array(); // Buffers... for the kernel.
            _KernelInputQueue = new TSOS.Queue(); // Where device input lands before being processed out somewhere.
            // Initialize the console.
            _Console = new TSOS.Console(); // The command line interface / console I/O device.
            _Console.init();
            // Initialize standard input and output to the _Console.
            _StdIn = _Console;
            _StdOut = _Console;
            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new TSOS.DeviceDriverKeyboard(); // Construct it.
            _krnKeyboardDriver.driverEntry(); // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);
            //Load the File System device driver
            this.krnTrace("Loading the File System device driver.");
            _krnFileSystemDriver = new TSOS.DeviceDriverFileSystem(); //Construct it.
            _krnFileSystemDriver.driverEntry(); //Call the driverEntry() initalization routine.
            this.krnTrace(_krnFileSystemDriver.status);
            //
            // ... more?
            //
            //Load the memoryManager
            _MemoryManager = new TSOS.MemoryManager();
            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();
            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new TSOS.Shell();
            _OsShell.init();
            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        };
        Kernel.prototype.krnShutdown = function () {
            this.krnTrace("begin shutdown OS");
            // TODO: Check for running processes.  If there are some, alert and stop. Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();
            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");
        };
        Kernel.prototype.krnOnCPUClockPulse = function () {
            /* This gets called from the host hardware simulation every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware / VM / host that tells the kernel
               that it has to look for interrupts and process them if it finds any.
            */
            // Check for an interrupt, if there are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO (maybe): Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            }
            else if (_CPU.isExecuting) { // If there are no interrupts then run one CPU cycle if there is anything being processed.
                //_CPU.cycle();
                if (_ScheduleType === "rr") {
                    if (_Running >= 2) {
                        if (_ScheduleCounter >= _Quantum) {
                            TSOS.scheduler.roundRobin();
                            _ScheduleCounter = 0;
                        }
                        else {
                            _ScheduleCounter++;
                            _CPU.cycle();
                        }
                    }
                    else if (_Running === 1) {
                        _CPU.cycle();
                    }
                }
                else if (_ScheduleType === "fcfs") {
                    if (_Running >= 2) {
                        if (_CurrentPCB.status === "Terminated") {
                        }
                        else {
                            _CPU.cycle();
                        }
                    }
                    else if (_Running === 1) {
                        _CPU.cycle();
                    }
                }
            }
            else { // If there are no interrupts and there is nothing being executed then just be idle.
                this.krnTrace("Idle");
            }
        };
        //
        // Interrupt Handling
        //
        Kernel.prototype.krnEnableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        };
        Kernel.prototype.krnDisableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        };
        Kernel.prototype.krnInterruptHandler = function (irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);
            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR(); // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params); // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case SOFTWARE_IRQ:
                    if (_Mode == 0) {
                        this.pcbSwitch();
                    }
                case SYSTEM_CALL:
                    if (_Mode == 0) {
                        this.systemCall();
                    }
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        };
        Kernel.prototype.krnTimerISR = function () {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
            // Or do it elsewhere in the Kernel. We don't really need this.
        };
        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile
        //
        // OS Utility Routines
        //
        Kernel.prototype.krnTrace = function (msg) {
            // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
            if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would quickly lag the browser quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        TSOS.Control.hostLog(msg, "OS");
                    }
                }
                else {
                    TSOS.Control.hostLog(msg, "OS");
                }
            }
        };
        Kernel.prototype.krnTrapError = function (msg) {
            TSOS.Control.hostLog("OS ERROR - TRAP: " + msg);
            // TODO: Display error on console, perhaps in some sort of colored screen. (Maybe blue?)
            this.krnShutdown();
        };
        Kernel.prototype.systemCall = function () {
            _Kernel.krnTrace("System Call");
            if (_CPU.Xreg == 1) {
                _StdOut.putText(_CPU.Yreg.toString(16));
                _StdOut.advanceLine();
            }
            else if (_CPU.Xreg == 2) {
                var print_1 = "";
                var startLocation = _CPU.Yreg;
                for (var i = startLocation; i < 256; i++) {
                    var newVal = parseInt(_MemoryAccessor.read(i), 16);
                    if (newVal >= 1 && newVal <= 9) {
                        print_1 += newVal;
                    }
                    else if (newVal == 0) {
                        break;
                    }
                    else {
                        print_1 += String.fromCharCode(newVal);
                    }
                }
                _StdOut.putText(print_1);
                _StdOut.advanceLine();
                _StdOut.putText(_OsShell.promptStr);
            }
            //_CPU.PC ++;
        };
        Kernel.prototype.pcbSwitch = function () {
            if (_ScheduleType === "rr") {
                if (_CurrentStoredPCB.length === 2) {
                    if (_CurrentPCB.PID === _CurrentStoredPCB[0].PID) {
                        TSOS.dispatcher.save();
                        if (_CurrentStoredPCB[1].state != "Terminated") {
                            _CurrentStoredPCB[0] = _CurrentPCB;
                            _CurrentStoredPCB[0].state = "Ready";
                            _CurrentPCB = _CurrentStoredPCB[1];
                            _CurrentStoredPCB[1].state = "Running";
                            TSOS.dispatcher.reload();
                        }
                    }
                    else {
                        TSOS.dispatcher.save();
                        if (_CurrentStoredPCB[0].state != "Terminated") {
                            _CurrentStoredPCB[1] = _CurrentPCB;
                            _CurrentStoredPCB[1].state = "Ready";
                            _CurrentPCB = _CurrentStoredPCB[0];
                            _CurrentStoredPCB[0].state = "Running";
                            TSOS.dispatcher.reload();
                        }
                    }
                }
                else if (_CurrentStoredPCB.length === 3) {
                    if (_CurrentPCB.PID === _CurrentStoredPCB[0].PID) {
                        TSOS.dispatcher.save();
                        _CurrentStoredPCB[0] = _CurrentPCB;
                        _CurrentPCB = _CurrentStoredPCB[1];
                        TSOS.dispatcher.reload();
                    }
                    else if (_CurrentPCB.PID === _CurrentStoredPCB[1].PID) {
                        TSOS.dispatcher.save();
                        _CurrentStoredPCB[1] = _CurrentPCB;
                        _CurrentPCB = _CurrentStoredPCB[2];
                        TSOS.dispatcher.reload();
                    }
                    else {
                        TSOS.dispatcher.save();
                        _CurrentStoredPCB[2] = _CurrentPCB;
                        _CurrentPCB = _CurrentStoredPCB[0];
                        TSOS.dispatcher.reload();
                    }
                }
                _MemoryAccessor.updateProcessDis();
            }
            else if (_ScheduleType === "fcfs") {
                for (var i = 0; i < _CurrentStoredPCB.length - 1; i++) {
                    if (_CurrentStoredPCB[i].PID === _CurrentPCB.PID) {
                        if (_CurrentStoredPCB[i].memSegment.length() === 1) {
                            TSOS.dispatcher.save();
                            _CurrentPCB = _CurrentStoredPCB[i + 1];
                            TSOS.dispatcher.reload();
                            return;
                        }
                    }
                }
            }
        };
        return Kernel;
    }());
    TSOS.Kernel = Kernel;
})(TSOS || (TSOS = {}));
