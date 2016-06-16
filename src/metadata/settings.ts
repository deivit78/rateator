/// <reference path="../typings/node.d.ts" />
var fs = require('fs');
var PropertiesReader = require('properties-reader');

export class Settings{
    private serverPort:string;
    private serverName:string;
    
    constructor(public pathSettings:string){
         let properties = PropertiesReader(pathSettings);
         this.serverPort = properties.get('mongo.port');
         this.serverName = properties.get('mongo.server');         
         console.log("Mongo Connection: "+this.serverPort+":"+this.serverName);         
    }    
}