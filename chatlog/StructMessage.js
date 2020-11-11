//StructMessage is the text file format for a message.
//We struct the message on different blocks of String

class StructMessage{

    constructor(struct) {
        return struct = { Blocks: [
            {idBlock: "STARTBLOCK", length: 8, val: "<STARTM>"},    
            {idBlock: "version", length: 32, val: ""},
            {idBlock: "idMessage", length: 32, val: ""}, 
            {idBlock: "idUser", length: 32, val: ""},
            {idBlock: "isVisible", length: 32, val: "1"}, // <- on front
            {idBlock: "idChatlog", length: 64, val: ""}, 
            {idBlock: "pseudo", length: 64, val: ""},
            {idBlock: "color", length: 7, val: ""},
            {idBlock: "effect", length: 64, val: ""},
            {idBlock: "font", length: 64, val: ""},
            {idBlock: "message", length: 5000, val: ""},
            {idBlock: "timestamp", length: 50, val: ""},
            {idBlock: "_info", length: 2000, val: ""},
            {idBlock: "ENDBLOCK", length: 8, val: "<ENDM__>"},    
        ]};
    }

}

module.exports = StructMessage;
