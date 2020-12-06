/* ----------------------------------
   deviceDriverFileSystem.ts

   The Kernel File System Device Driver.
   ---------------------------------- */

module TSOS{

    export class deviceDriverFileSystem extends DeviceDriver{

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
            _StdOut.putText("The Disk is now formatted.");
            this.status = "formatted";
        }

        //This will return a key based on the track sector and block
        public getKey(track, sector, block){
            let t = track.toString(16).toUpperCase().padStart(2, "0");
            let s = sector.toString(16).toUpperCase().padStart(2, "0");
            let b = block.toString(16).toUpperCase().padStart(2, "0");
            let key = t+s+b;
            return key;
        }

        public setStorage(key, data){
            sessionStorage.setItem(key, data);
        }
    }
}