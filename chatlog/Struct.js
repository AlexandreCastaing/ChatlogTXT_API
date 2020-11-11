//Struct is the text file format for an object.

// this is the format for one struct, 
    // .idBlock     name id of the block
    // .val:        the string value
    // .length:     the numb of caracts for the ".val" string value

let StructMessage = require("./structMessage.js");
let StructChatlog = require("./structChatlog.js");

class Struct{

    constructor(structType) { 
        let struct = {};
        switch(structType){
            case "Message": struct = new StructMessage(); break;
            case "Chatlog": struct = new StructChatlog(); break;
            default: return null;
        }
        return this.newStruct(struct);
    }

    // construct & return a new struct Object
    newStruct(struct_Default){ 

        let struct = {};
        struct.Blocks = [];
        struct.totalLength = 0;

        struct_Default.Blocks.forEach(block => 
            {
                let newblock = {};
                newblock.idBlock = block.idBlock;
                newblock.length = block.length;
                newblock.val = block.val;

                struct.totalLength += block.length;

                struct.Blocks.push(newblock);
            }
        )
        //return the new object
        return struct;
    }

}

module.exports = Struct;
