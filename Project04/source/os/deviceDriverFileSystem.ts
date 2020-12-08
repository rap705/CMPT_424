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
        public writeFile(){
            
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
    }
}