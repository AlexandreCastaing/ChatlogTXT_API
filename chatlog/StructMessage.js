//StructMessage is the text file format for a message.
//We struct the message on different blocks of String
    
// this is the format for one message, 
    // .idBlock     name id of the block
    // .val:        the string value
    // .length:     the numb of caracts for the ".val" string value

structMessage_Default = { Blocks: [
    {idBlock: "STARTBLOCK", length: 8, val: "<START_>"},    
    {idBlock: "version", length: 32, val: ""},
    {idBlock: "idMessage", length: 32, val: ""}, 
    {idBlock: "idUser", length: 32, val: ""},
    {idBlock: "isVisible", length: 32, val: "1"}, // <- on front
    {idBlock: "idChatlog", length: 64, val: ""}, 
    {idBlock: "pseudo", length: 64, val: ""},
    {idBlock: "color", length: 7, val: ""},
    {idBlock: "effect", length: 64, val: ""},
    {idBlock: "font", length: 64, val: ""},
    {idBlock: "message", length: 3000, val: ""},
    {idBlock: "timestamp", length: 50, val: ""},
    {idBlock: "info1", length: 32, val: ""},
    {idBlock: "info2", length: 32, val: ""},
    {idBlock: "info3", length: 32, val: ""},
    {idBlock: "info4", length: 64, val: ""},
    {idBlock: "info5", length: 64, val: ""},
    {idBlock: "info6", length: 64, val: ""},
    {idBlock: "info7", length: 128, val: ""},
    {idBlock: "info8", length: 128, val: ""},
    {idBlock: "ENDBLOCK", length: 8, val: "<END___>"},    
]};

class StructMessage{

    constructor() { return this.newStructMessage();}

    // construct & return a new structMessage Object
    newStructMessage(){ 

        let structMessage = {};
        structMessage.Blocks = [];
        structMessage.totalLength = 0;

        structMessage_Default.Blocks.forEach(block => 
            {
                let newblock = {};
                newblock.idBlock = block.idBlock;
                newblock.length = block.length;
                newblock.val = block.val;

                structMessage.totalLength += block.length;

                structMessage.Blocks.push(newblock);
            }
        )

        //return the new object
        return structMessage;
    }

}

module.exports = StructMessage;
