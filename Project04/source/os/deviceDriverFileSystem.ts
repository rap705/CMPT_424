/* ----------------------------------
   deviceDriverFileSystem.ts

   The Kernel File System Device Driver.
   ---------------------------------- */

module TSOS{

    export class DeviceDriverFileSystem extends DeviceDriver{

        constructor() {  
            super();
            this.driverEntry = this.krnFSDriverEntry;
        }

        public krnFSDriverEntry(){
            this.status = "loaded";
        }

        //This will format the drive with 
        public formatDrive(){
            if(this.status !== "formatted"){
                //This will initialize the display for the Hard Drive

            }
            for(let i = 0; i < 4; i++){
                for(let k = 0; k < 8; k++){
                    for(let j = 0; j < 8; j++){
                        let key = this.getKey(i, k, j);
                        this.setStorage(key, ("00" + key).padEnd(128, "0"));
                    }
                }
            }
            this.setStorage("000000", "01".padEnd(128, "0"));
            _StdOut.putText("The disk was successfully formatted.");
            this.status = "formatted";
        }

        //This will create a file on the disk with the specified name
        public createFile(name){
            let dirKey = this.findDirKey();
            if(dirKey !== null){
                let hexName = this.asciiToHex(name);
                this.setStorage(dirKey, ("01" + dirKey + hexName).padEnd(128, "0"));
                _StdOut.putText("Created file: " + name);
            }
            else{
                _StdOut.putText("There are no available directory blocks.");
            }

        }

        //This will write data to a file on the disk
        public writeFile(filename, data){
            //Checks to see if the data was placed in quotes so we know what should be in the file
            let hexData = ""
            if(data[0] === "\"" && data[data.length - 1] === "\""){
                data = data.substring(1, data.length-1);
                //This needs to be done because data is an array and the function only accounts for the first item in the array its given
                for(let i = 0; i < data.length; i++){
                    hexData += this.asciiToHex(data[i]);
                }
                let fileKey = this.searchFileName(filename);
                if(fileKey !== null){
                    let fileDirectoryBlock = sessionStorage.getItem(fileKey);
                    if(this.getBlockPointer(fileDirectoryBlock) !== fileKey){
                        this.deallocateBlock(this.getBlockPointer(fileDirectoryBlock));
                    }
                    let dataKeys = [];
                    for(let i = 0; i < hexData.length / 120; i++){
                        let openDataKey = this.findDataBlock();
                        if(openDataKey === null){
                            _StdOut.putText("Not enough data blocks to store text.")
                            return;
                        }
                        dataKeys.push(openDataKey);
                        this.setStorage(openDataKey, ("01" + openDataKey).padEnd(128, "0"))
                    }

                    //Begin writing the data to data blocks
                    this.setStorage(fileKey, ("01" + dataKeys[0] + sessionStorage.getItem(fileKey).substring(8)));
                    for(let i = 0; i < dataKeys.length; i++){
                        if(i !== dataKeys.length-1){
                            this.setStorage(dataKeys[i], ("01" + dataKeys[i+1] + hexData.substring(i * 60 * 2, (i + 1) * 60 * 2)).padEnd(128, "0"));
                        }
                        else{
                            this.setStorage(dataKeys[i], ("01" + dataKeys[i] + hexData.substring(i * 60 * 2)).padEnd(128, "0"));
                        }
                    }
                    _StdOut.putText("Data successfully written to file: " + filename)
                }
            }
            else{
                _StdOut.putText("Error: Data must be in quotes.")
            }
        }

        //Read the specified file
        public readFile(filename){
            let fileDirectoryKey = this.searchFileName(filename);
            if(fileDirectoryKey !== null){
                let fileDirectoryBlock = sessionStorage.getItem(fileDirectoryKey);
                let dataPointer = this.getBlockPointer(fileDirectoryBlock);
                if(fileDirectoryKey === dataPointer){
                    _StdOut.putText("The file has not been written to yet.")
                    return;
                }
                let data = this.readFileData(dataPointer);
                _StdOut.putText(data);
            }
            else{
                _StdOut.putText("The file does not exist.")
                return;
            }
        }

        //Delete the specified file
        public deleteFile(filename){
            let dirKey = this.searchFileName(filename);
            if(dirKey !== null){
                let dirBlock = sessionStorage.getItem(dirKey);
                let dataPointer = this.getBlockPointer(dirBlock);
                if(dataPointer !== dirBlock){
                    this.deallocateBlock(dataPointer);
                }
                this.setStorage(dirKey , ("00" + dirKey + this.getBlockDataRaw(dirBlock)));
                _StdOut.putText("File: " + filename + " was successfully deleted.");
            }
            else{
                _StdOut.putText("The file does not exist.")
            }
        }

        //This will return a key based on the track sector and block
        public getKey(track, sector, block){
            let t = track.toString(16).toUpperCase().padStart(2, "0");
            let s = sector.toString(16).toUpperCase().padStart(2, "0");
            let b = block.toString(16).toUpperCase().padStart(2, "0");
            let key = t+s+b;
            return key;
        }

        //This will set the item in session Storage given a key and data value
        public setStorage(key, data){
            sessionStorage.setItem(key, data);
        }

        //Find the dir key
        public findDirKey(){
            for(let i = 0; i < 8; i++){
                for(let k = 0; k < 8; k++){
                    if(i !== 0 || k !== 0){
                        let key = this.getKey(0, i, k);
                        let block = sessionStorage.getItem(key);
                        if(this.blockFree(block)){
                            return key;
                        }
                    }
                }
            }
            return null;
        }

        //Create checks to see if the block is free or in use
        public blockFree(block){
            let check = block.substring(0 , 2);
            if(check === "01"){
                return false;
            }
            return true;
        }

        //Returns the hex of the given ascii
        public asciiToHex(str){
            let finalHex = "";
            for(let i = 0; i < str[0].length; i++){
                let convert = str[0].charCodeAt(i).toString(16);
                convert = convert.toUpperCase();
                finalHex += convert;
            }
            return finalHex;
        }

        //Searches for the given filename
        public searchFileName(name){
            for(let i = 0; i < 8; i++){
                for(let k = 0; k < 8; k++){
                    if(i !== 0 || k !== 0){
                        let key = this.getKey(0, i, k);
                        let block = sessionStorage.getItem(key);
                        if(!this.blockFree(block)){
                            let blockFileName = this.getBlockData(block);
                            if(blockFileName === name){
                                return key;
                            }
                        }
                    }
                }
            }
            return null;
        }

        //Gets all of the data from the specified block
        public getBlockData(block){
            let data = "";
            for(let i = 4; i < 64; i++){
                let byte = block.substring(i*2 , i*2+2);
                if(byte !== "00"){
                    data += String.fromCharCode(parseInt(byte, 16));
                }
                else{
                    return data;
                }
            }
        }

        //Gets the block pointer 
        public getBlockPointer(block){
            let result = block.substring(2 , 8);
            return result;
        }

        //This will deallocate the block so that it can be reused
        public deallocateBlock(blockPointer){
            let block = sessionStorage.getItem(blockPointer);
            while(blockPointer !== this.getBlockPointer(block)){
                let oldPoint = blockPointer;
                blockPointer = this.getBlockPointer(block);
                this.setStorage(oldPoint, "00" + oldPoint + this.getBlockDataRaw(block));
            }
        }

        //This will return the block data without converting it from hex
        public getBlockDataRaw(block){
            let result = "";
            for(let i = 4; i < 64; i++){
                let byte = block.substring(i * 2, i * 2 + 2)
                result += byte;
            }
            return result;
        }

        //Finds the next open data block
        public findDataBlock(){
            for(let i = 1; i < 4; i++){
                for(let k = 0; k < 8; k++){
                    for(let j = 0; j < 8; j++){
                        let key = this.getKey(i , k, j);
                        var block = sessionStorage.getItem(key);
                        if(this.blockFree(block)){
                            return key;
                        }
                    }
                }
            }
            return null;
        }

        //Read data from a file and return the ascii value
        public readFileData(blockPointer){
            let data = "";
            let block = sessionStorage.getItem(blockPointer);
            while(blockPointer !== this.getBlockPointer(block)){
                data += this.getBlockData(block);
                blockPointer = this.getBlockPointer(block);
                block = sessionStorage.getItem(blockPointer);
            }
            data += this.getBlockData(block);
            return data;
        }

    }
}