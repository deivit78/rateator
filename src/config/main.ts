/// <reference path="../typings/node.d.ts" />
var fs = require('fs');
var PropertiesReader = require('properties-reader');

export class Settings{
    private mongoServer:string;
    private mongoPort:string;
    
    constructor(public pathSettings:string){
         let properties = PropertiesReader(pathSettings);
         this.mongoServer = properties.get('mongo.server');
         this.mongoPort = properties.get('mongo.port');         
         console.log("Mongo Connection: "+this.mongoServer+":"+this.mongoPort);         
    }    
}