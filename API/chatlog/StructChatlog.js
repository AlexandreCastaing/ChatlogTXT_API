//StructChatlog is the text file format for a chatlog object.
//We struct the chatlog on different blocks of String

class StructChatlog{

    constructor(struct) {
        return struct = { Blocks: [
            {idBlock: "STARTBLOCK", length: 8, val: "<STARTC>"},    
            {idBlock: "version", length: 32, val: ""},
            {idBlock: "idChatlog", length: 32, val: ""}, 
            {idBlock: "idUser", length: 32, val: ""}, // control the chatlog
            {idBlock: "isVisible", length: 32, val: "1"}, // <- on front
            {idBlock: "name", length: 32, val: ""}, // <- on front
            {idBlock: "description", length: 5000, val: ""},
            {idBlock: "color", length: 7, val: ""},
            {idBlock: "effect", length: 64, val: ""},   
            {idBlock: "font", length: 64, val: ""},
            {idBlock: "icon", length: 64, val: ""},
            {idBlock: "colorMessagesDefault", length: 7, val: ""},
            {idBlock: "effectMessagesDefault", length: 64, val: ""},
            {idBlock: "fontMessagesDefault", length: 64, val: ""},
            {idBlock: "timestamp", length: 50, val: ""},
            {idBlock: "hasPassword", length: 32, val: ""}, // 0 = false / 1 = true
            {idBlock: "password", length: 32, val: ""},    
            {idBlock: "_info", length: 2000, val: ""},
            {idBlock: "ENDBLOCK", length: 8, val: "<ENDC__>"},    
        ]};
    }

}

module.exports = StructChatlog;
