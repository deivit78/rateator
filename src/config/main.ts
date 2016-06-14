/// <reference path="../typings/node.d.ts" />
import fs = require('fs');
export class Settings{
    private fileContent:string;
    constructor(public pathSettings:string){
         fs.readFileSync(pathSettings,(err,buf)=>{
             this.fileContent = buf;
             console.log(this.fileContent);
         });               
    }    
}