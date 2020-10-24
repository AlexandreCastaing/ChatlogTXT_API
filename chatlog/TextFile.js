//Work on the text file
// /!\  the file must be writen just 1 time by time

//todo: to remove require('shelljs/global');

let StructMessageClass = require("./StructMessage.js");

const TextFile = class{

    constructor(_ChatlogService){
        this.chatlogService = _ChatlogService;

        this.fs = require('fs');
        this.fileName = process.env.TXT_FILE;
    };

    Write_structMessage_File(_structMessage){
        let dataFile = this.structMessageToDataFile(_structMessage);
        this.writeOnFile(dataFile);
    }

    Read_structMessages_File(){

        let totalLengthSM = this.getStructMessageLength();
        let contentFile = this.readOnFile(); // <- todo: optimise

        let structMessages = [];

        for(
            let positionStructMessage = 0; 
            positionStructMessage < contentFile.toString().length; 
            positionStructMessage+= totalLengthSM
            ){
                let dataStructMessage = contentFile.substring(positionStructMessage, totalLengthSM + positionStructMessage);
                let structMessage = this.dataFileToStructMessage(dataStructMessage);
                structMessages.push(structMessage)

            }
            
        return structMessages;
    }

    writeOnFile(_data){

        // if file is not locked
        if( process.env.SOMEONE_WRITING_ON_TXTFILE == "false" ){
            // lock the file 
            process.env.SOMEONE_WRITING_ON_TXTFILE = "true";
            this.fs.appendFile(this.fileName, _data, function (err) {
                if (err) {
                    // close timer + unlock the file
                    clearTimeout(this.intervalWMode) 
                    process.env.SOMEONE_WRITING_ON_TXTFILE = "false";
                    console.log(err);
                }
            });
            // close timer + unlock the file
            clearTimeout(this.intervalWMode) 
            process.env.SOMEONE_WRITING_ON_TXTFILE = "false";
        }else{
            setTimeout(this.writeOnFile(_data), process.env.TIMEOUT_ACTIONFILE);
        }
    }

    readOnFile(){
        let data;
        return this.readOnFileSub(data);
    }
    readOnFileSub(data){
        // if file is not locked
        if( process.env.SOMEONE_WRITING_ON_TXTFILE == "false" ){
                    
            // lock the file 
            process.env.SOMEONE_WRITING_ON_TXTFILE = "true";

            data = this.fs.readFileSync(this.fileName, 'utf-8');

            // close timer + unlock the file
            clearTimeout(this.intervalWMode) 
            process.env.SOMEONE_WRITING_ON_TXTFILE = "false";

            return data;
        }else{
            setTimeout(this.readOnFileSub(data), process.env.TIMEOUT_ACTIONFILE);
        }
    }

    replaceOnFile(_oldData, _data){

        let good = true;

        // if file is not locked
        if( process.env.SOMEONE_WRITING_ON_TXTFILE == "false" ){
            // lock the file 
            process.env.SOMEONE_WRITING_ON_TXTFILE = "true";
           
            // read file
            let readData = this.fs.readFileSync(this.fileName, 'utf-8');

            // do 
            readData = readData.replace(_oldData, _data);
            
            this.fs.writeFile(this.fileName, readData, function (err) {
                if (err) {
                    good = false;
                    // close timer + unlock the file
                    clearTimeout(this.intervalWMode) 
                    process.env.SOMEONE_WRITING_ON_TXTFILE = "false";
                    console.log(err);
                }
            });
    
            // close timer + unlock the file
            clearTimeout(this.intervalWMode) 
            process.env.SOMEONE_WRITING_ON_TXTFILE = "false";
        }else{
            setTimeout(this.writeOnFile(_data), process.env.TIMEOUT_ACTIONFILE);
        }

        return good;
    }

    structMessageToDataFile(_structMessage){
        let dataFile = "";
        let position = 0;

        _structMessage.Blocks.forEach(block => 
            {
                // trunc string
                if(block.val == null) block.val = "";
                block.val = block.val.toString().substring(0, block.length);
                dataFile += block.val.padEnd(block.length, " ");   

                position += block.length;

            }
        )
        return dataFile.toString();
    }

    dataFileToStructMessage(_dataFile){
        let position = 0;

        let structMessage = new StructMessageClass();

        structMessage.Blocks.forEach(block => 
            {
                block.val = _dataFile.substring(position, block.length + position );

                position += block.length;
            }
        )
        return structMessage;
    }

    // return total length StructMessage
    getStructMessageLength(){
        let v = 0;
        let structMessage = new StructMessageClass();
        structMessage.Blocks.forEach(block => 
            {
                v+=block.length;
            }
        )
        return v;
    }

    // replace StructMessage
    Replace_structMessage_File(_oldStructMessage, _newStructMessage){

        let olddata = this.structMessageToDataFile(_oldStructMessage);
        let newdata = this.structMessageToDataFile(_newStructMessage);
        return this.replaceOnFile(olddata, newdata);

    }
 
}

module.exports = TextFile;