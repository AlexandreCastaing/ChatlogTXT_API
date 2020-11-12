//Work on the text file
// /!\  the file must be writen just 1 time by time

//todo: to remove require('shelljs/global');

let StructClass = require("./Struct.js");

const TextFile = class{

    constructor(_ChatlogService, _filename, _structType){
        this.chatlogService = _ChatlogService;

        this.fs = require('fs');
        this.fileName = _filename;
        this.structType = _structType;
    };

    Write_struct_File(_struct){
        let dataFile = this.structToDataFile(_struct);
        this.writeOnFile(dataFile);
    }

    Read_struct_File(){
       
        let totalLengthSM = this.getStructLength();
        let contentFile = this.readOnFile(); // <- todo: optimise

        let structs = [];

        for(
            let positionStruct = 0; 
            positionStruct < contentFile.toString().length; 
            positionStruct+= totalLengthSM
            ){
                let dataStruct = contentFile.substring(positionStruct, totalLengthSM + positionStruct);
                let struct = this.dataFileToStruct(dataStruct);
                structs.push(struct)

            }
            
        return structs;
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

    structToDataFile(_struct){
        let dataFile = "";
        let position = 0;

        _struct.Blocks.forEach(block => 
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

    dataFileToStruct(_dataFile){
        let position = 0;

        let struct = new StructClass(this.structType);

        struct.Blocks.forEach(block => 
            {
                block.val = _dataFile.substring(position, block.length + position );

                position += block.length;
            }
        )
        return struct;
    }

    // return total length Struct
    getStructLength(){
        let v = 0; 
        let struct = new StructClass(this.structType); 
        struct.Blocks.forEach(block => 
            {
                v+=block.length;
            }
        )
        return v;
    }

    // replace Struct
    Replace_struct_File(_oldStruct, _newStruct){

        let olddata = this.structToDataFile(_oldStruct);
        let newdata = this.structToDataFile(_newStruct);
        return this.replaceOnFile(olddata, newdata);

    }
 
}

module.exports = TextFile;