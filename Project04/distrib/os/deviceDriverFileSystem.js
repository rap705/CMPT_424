/* ----------------------------------
   deviceDriverFileSystem.ts

   The Kernel File System Device Driver.
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
    var DeviceDriverFileSystem = /** @class */ (function (_super) {
        __extends(DeviceDriverFileSystem, _super);
        function DeviceDriverFileSystem() {
            var _this = _super.call(this) || this;
            _this.driverEntry = _this.krnFSDriverEntry;
            return _this;
        }
        DeviceDriverFileSystem.prototype.krnFSDriverEntry = function () {
            this.status = "loaded";
        };
        //This will format the drive with 
        DeviceDriverFileSystem.prototype.formatDrive = function () {
            if (this.status !== "formatted") {
                //This will initialize the display for the Hard Drive
                TSOS.Utils.initDiskTable();
            }
            for (var i = 0; i < 4; i++) {
                for (var k = 0; k < 8; k++) {
                    for (var j = 0; j < 8; j++) {
                        var key = this.getKey(i, k, j);
                        this.setStorage(key, ("00" + key).padEnd(128, "0"));
                    }
                }
            }
            this.setStorage("000000", "01".padEnd(128, "0"));
            _StdOut.putText("The disk was successfully formatted.");
            this.status = "formatted";
        };
        //This will create a file on the disk with the specified name
        DeviceDriverFileSystem.prototype.createFile = function (name) {
            var dirKey = this.findDirKey();
            if (dirKey !== null) {
                var check = this.searchFileName(name[0]);
                if (check === null) {
                    var hexName = this.asciiToHex(name);
                    this.setStorage(dirKey, ("01" + dirKey + hexName).padEnd(128, "0"));
                    _StdOut.putText("Created file: " + name);
                }
                else {
                    _StdOut.putText("File named: " + name + " already exists.");
                }
            }
            else {
                _StdOut.putText("There are no available directory blocks.");
            }
        };
        //This will write data to a file on the disk
        DeviceDriverFileSystem.prototype.writeFile = function (filename, data) {
            //Checks to see if the data was placed in quotes so we know what should be in the file
            var hexData = "";
            if (data[0] === "\"" && data[data.length - 1] === "\"") {
                data = data.substring(1, data.length - 1);
                //This needs to be done because data is an array and the function only accounts for the first item in the array its given
                for (var i = 0; i < data.length; i++) {
                    hexData += this.asciiToHex(data[i]);
                }
                var fileKey = this.searchFileName(filename);
                if (fileKey !== null) {
                    var fileDirectoryBlock = sessionStorage.getItem(fileKey);
                    if (this.getBlockPointer(fileDirectoryBlock) !== fileKey) {
                        this.deallocateBlock(this.getBlockPointer(fileDirectoryBlock));
                    }
                    var dataKeys = [];
                    for (var i = 0; i < hexData.length / 120; i++) {
                        var openDataKey = this.findDataBlock();
                        if (openDataKey === null) {
                            _StdOut.putText("Not enough data blocks to store text.");
                            return;
                        }
                        dataKeys.push(openDataKey);
                        this.setStorage(openDataKey, ("01" + openDataKey).padEnd(128, "0"));
                    }
                    //Begin writing the data to data blocks
                    this.setStorage(fileKey, ("01" + dataKeys[0] + sessionStorage.getItem(fileKey).substring(8)));
                    for (var i = 0; i < dataKeys.length; i++) {
                        if (i !== dataKeys.length - 1) {
                            this.setStorage(dataKeys[i], ("01" + dataKeys[i + 1] + hexData.substring(i * 60 * 2, (i + 1) * 60 * 2)).padEnd(128, "0"));
                        }
                        else {
                            this.setStorage(dataKeys[i], ("01" + dataKeys[i] + hexData.substring(i * 60 * 2)).padEnd(128, "0"));
                        }
                    }
                    _StdOut.putText("Data successfully written to file: " + filename);
                }
            }
            else {
                _StdOut.putText("Error: Data must be in quotes.");
            }
        };
        //Read the specified file
        DeviceDriverFileSystem.prototype.readFile = function (filename) {
            var fileDirectoryKey = this.searchFileName(filename);
            if (fileDirectoryKey !== null) {
                var fileDirectoryBlock = sessionStorage.getItem(fileDirectoryKey);
                var dataPointer = this.getBlockPointer(fileDirectoryBlock);
                if (fileDirectoryKey === dataPointer) {
                    _StdOut.putText("The file has not been written to yet.");
                    return;
                }
                var data = this.readFileData(dataPointer);
                _StdOut.putText(data);
            }
            else {
                _StdOut.putText("The file does not exist.");
                return;
            }
        };
        //Delete the specified file
        DeviceDriverFileSystem.prototype.deleteFile = function (filename) {
            var dirKey = this.searchFileName(filename);
            if (dirKey !== null) {
                var dirBlock = sessionStorage.getItem(dirKey);
                var dataPointer = this.getBlockPointer(dirBlock);
                if (dataPointer !== dirBlock) {
                    this.deallocateBlock(dataPointer);
                }
                this.setStorage(dirKey, ("00" + dirKey + this.getBlockDataRaw(dirBlock)));
                _StdOut.putText("File: " + filename + " was successfully deleted.");
            }
            else {
                _StdOut.putText("The file does not exist.");
            }
        };
        //This will return a key based on the track sector and block
        DeviceDriverFileSystem.prototype.getKey = function (track, sector, block) {
            var t = track.toString(16).toUpperCase().padStart(2, "0");
            var s = sector.toString(16).toUpperCase().padStart(2, "0");
            var b = block.toString(16).toUpperCase().padStart(2, "0");
            var key = t + s + b;
            return key;
        };
        //This will set the item in session Storage given a key and data value
        DeviceDriverFileSystem.prototype.setStorage = function (key, data) {
            sessionStorage.setItem(key, data);
            TSOS.Utils.updateDiskRow(key);
        };
        //Find the dir key
        DeviceDriverFileSystem.prototype.findDirKey = function () {
            for (var i = 0; i < 8; i++) {
                for (var k = 0; k < 8; k++) {
                    if (i !== 0 || k !== 0) {
                        var key = this.getKey(0, i, k);
                        var block = sessionStorage.getItem(key);
                        if (this.blockFree(block)) {
                            return key;
                        }
                    }
                }
            }
            return null;
        };
        //Create checks to see if the block is free or in use
        DeviceDriverFileSystem.prototype.blockFree = function (block) {
            var check = block.substring(0, 2);
            if (check === "01") {
                return false;
            }
            return true;
        };
        //Returns the hex of the given ascii
        DeviceDriverFileSystem.prototype.asciiToHex = function (str) {
            var finalHex = "";
            for (var i = 0; i < str[0].length; i++) {
                var convert = str[0].charCodeAt(i).toString(16);
                convert = convert.toUpperCase();
                finalHex += convert;
            }
            return finalHex;
        };
        //Searches for the given filename
        DeviceDriverFileSystem.prototype.searchFileName = function (name) {
            for (var i = 0; i < 8; i++) {
                for (var k = 0; k < 8; k++) {
                    if (i !== 0 || k !== 0) {
                        var key = this.getKey(0, i, k);
                        var block = sessionStorage.getItem(key);
                        if (!this.blockFree(block)) {
                            var blockFileName = this.getBlockData(block);
                            if (blockFileName === name) {
                                return key;
                            }
                        }
                    }
                }
            }
            return null;
        };
        //Gets all of the data from the specified block
        DeviceDriverFileSystem.prototype.getBlockData = function (block) {
            var data = "";
            for (var i = 4; i < 64; i++) {
                var byte = block.substring(i * 2, i * 2 + 2);
                if (byte !== "00") {
                    data += String.fromCharCode(parseInt(byte, 16));
                }
                else {
                    return data;
                }
            }
        };
        //Gets the block pointer 
        DeviceDriverFileSystem.prototype.getBlockPointer = function (block) {
            var result = block.substring(2, 8);
            return result;
        };
        //This will deallocate the block so that it can be reused
        DeviceDriverFileSystem.prototype.deallocateBlock = function (blockPointer) {
            var block = sessionStorage.getItem(blockPointer);
            while (blockPointer !== this.getBlockPointer(block)) {
                var oldPoint = blockPointer;
                blockPointer = this.getBlockPointer(block);
                this.setStorage(oldPoint, "00" + oldPoint + this.getBlockDataRaw(block));
            }
        };
        //This will return the block data without converting it from hex
        DeviceDriverFileSystem.prototype.getBlockDataRaw = function (block) {
            var result = "";
            for (var i = 4; i < 64; i++) {
                var byte = block.substring(i * 2, i * 2 + 2);
                result += byte;
            }
            return result;
        };
        //Finds the next open data block
        DeviceDriverFileSystem.prototype.findDataBlock = function () {
            for (var i = 1; i < 4; i++) {
                for (var k = 0; k < 8; k++) {
                    for (var j = 0; j < 8; j++) {
                        var key = this.getKey(i, k, j);
                        var block = sessionStorage.getItem(key);
                        if (this.blockFree(block)) {
                            return key;
                        }
                    }
                }
            }
            return null;
        };
        //Read data from a file and return the ascii value
        DeviceDriverFileSystem.prototype.readFileData = function (blockPointer) {
            var data = "";
            var block = sessionStorage.getItem(blockPointer);
            while (blockPointer !== this.getBlockPointer(block)) {
                data += this.getBlockData(block);
                blockPointer = this.getBlockPointer(block);
                block = sessionStorage.getItem(blockPointer);
            }
            data += this.getBlockData(block);
            return data;
        };
        //List all files on the disk
        DeviceDriverFileSystem.prototype.listAllFiles = function () {
            var files = [];
            for (var i = 0; i < 4; i++) {
                for (var k = 0; k < 8; k++) {
                    if (i !== 0 || k !== 0) {
                        var block = sessionStorage.getItem(this.getKey(0, i, k));
                        if (!this.blockFree(block)) {
                            var filename = this.getBlockData(block);
                            files.push(filename);
                            _StdOut.putText(filename);
                            _StdOut.advanceLine();
                        }
                    }
                }
            }
            if (files.length === 0) {
                _StdOut.putText("No files currently stored on disk.");
            }
        };
        //parse key for use when printing to screen
        DeviceDriverFileSystem.prototype.parseKey = function (key) {
            var i = parseInt(key.substring(0, 2), 16).toString();
            var j = parseInt(key.substring(4, 6), 16).toString(16);
            var k = parseInt(key.substring(2, 4), 16).toString(16);
            return { i: i, j: j, k: k };
        };
        DeviceDriverFileSystem.prototype.writeProcess = function (userInput, pid) {
            var filename = _SwapFile + pid + " ";
            var finalFilename = filename.split(" ");
            var dirKey = this.findDirKey();
            //Create the file 
            if (dirKey !== null) {
                var check = this.searchFileName(finalFilename[0]);
                if (check === null) {
                    var hexName = this.asciiToHex(finalFilename);
                    this.setStorage(dirKey, ("01" + dirKey + hexName).padEnd(128, "0"));
                }
                else {
                    _StdOut.putText("Error: Process already exists");
                    return null;
                }
            }
            else {
                _StdOut.putText("There are no available directory blocks.");
                return null;
            }
            //Write file to Disk
            if (dirKey !== null) {
                var fileDirectoryBlock = sessionStorage.getItem(dirKey);
                if (this.getBlockPointer(fileDirectoryBlock) !== dirKey) {
                    this.deallocateBlock(this.getBlockPointer(fileDirectoryBlock));
                }
                var dataKeys = [];
                for (var i = 0; i < userInput.length / 120; i++) {
                    var openDataKey = this.findDataBlock();
                    if (openDataKey === null) {
                        _StdOut.putText("Not enough data blocks to store process.");
                        return null;
                    }
                    dataKeys.push(openDataKey);
                    this.setStorage(openDataKey, ("01" + openDataKey).padEnd(128, "0"));
                }
                this.setStorage(dirKey, ("01" + dataKeys[0] + sessionStorage.getItem(dirKey).substring(8)));
                for (var i = 0; i < dataKeys.length; i++) {
                    if (i !== dataKeys.length - 1) {
                        this.setStorage(dataKeys[i], ("01" + dataKeys[i + 1] + userInput.substring(i * 60 * 2, (i + 1) * 60 * 2)).padEnd(128, "0"));
                    }
                    else {
                        this.setStorage(dataKeys[i], ("01" + dataKeys[i] + userInput.substring(i * 60 * 2)).padEnd(128, "0"));
                    }
                }
                _StdOut.putText("Data successfully written to file: " + filename);
            }
        };
        return DeviceDriverFileSystem;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
