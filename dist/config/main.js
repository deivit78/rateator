"use strict";
/// <reference path="../typings/node.d.ts" />
var fs = require('fs');
var Settings = (function () {
    function Settings(pathSettings) {
        var _this = this;
        this.pathSettings = pathSettings;
        fs.readFileSync(pathSettings, function (err, buf) {
            _this.fileC;
            ontent = buf;
            console.log(_this.fileContent);
        });
    }
    return Settings;
}());
exports.Settings = Settings;
