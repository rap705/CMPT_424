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
            _StdOut.putText("The Disk is now formatted.");
            this.status = "formatted";
        };
        //This will create a file on the disk with the specified name
        DeviceDriverFileSystem.prototype.createFile = function () {
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
        };
        return DeviceDriverFileSystem;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
