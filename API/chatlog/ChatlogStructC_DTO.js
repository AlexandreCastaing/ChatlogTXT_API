//Util who convert Message to MessageStruct & Versa.
let ChatlogClass = require("./Chatlog.js");
let StructChatlogClass = require("./StructChatlog.js");

const ChatlogStructDTO = class{

    // conversion
    static structChatlog_to_Chatlog(_structChatlog){

        let chatlog = new ChatlogClass();

        _structChatlog.Blocks.forEach(block => 
            {
                let val = block.val.trim(); // remove spaces
                switch(block.idBlock){              
                    case 'version': chatlog.version = val; break;
                    case 'idChatlog': chatlog.idChatlog = val; break;
                    case 'idUser': chatlog.idUser = val; break;
                    case 'isVisible': chatlog.isVisible = val; break;
                    case 'name': chatlog.name = val; break;
                    case 'description': chatlog.description = val; break;
                    case 'color': chatlog.color = val; break;
                    case 'effect': chatlog.effect = val; break;
                    case 'font': chatlog.font = val; break;
                    case 'icon': chatlog.icon = val; break;
                    case 'colorMessagesDefault': chatlog.colorMessages = val; break;
                    case 'effectMessagesDefault': chatlog.effectMessages = val; break;
                    case 'fontMessagesDefault': chatlog.fontMessages = val; break;
                    case 'timestamp': chatlog.timestamp = val; break;
                    case 'hasPassword': chatlog.hasPassword = val; break;
                    case 'password': chatlog.password = val; break;   
                }
            }
        )
    
        return chatlog;
 
    }

    // conversion
    static Chatlog_to_structChatlog(_chatlog){

        let structChatlog = new StructChatlogClass();

        structChatlog.Blocks.forEach(block => 
            {
                switch(block.idBlock){              
                    case 'version':  block.val = _chatlog.version; break;
                    case 'idChatlog': block.val = _chatlog.idChatlog; break;
                    case 'idUser': block.val = _chatlog.idUser; break;
                    case 'isVisible':  block.val = _chatlog.isVisible; break;
                    case 'name':  block.val = _chatlog.name; break;
                    case 'description': block.val = _chatlog.description; break;
                    case 'color':  block.val = _chatlog.color; break;
                    case 'effect':  block.val = _chatlog.effect; break;
                    case 'font':  block.val = _chatlog.font; break;
                    case 'icon':  block.val = _chatlog.icon; break;
                    case 'colorMessagesDefault':  block.val = _chatlog.colorMessages; break;
                    case 'effectMessagesDefault':  block.val = _chatlog.effectMessages; break;
                    case 'fontMessagesDefault':  block.val = _chatlog.fontMessages; break;
                    case 'timestamp':  block.val = _chatlog.timestamp; break;
                    case 'hasPassword':  block.val = _chatlog.hasPassword; break;
                    case 'password':  block.val = _chatlog.password; break;
                }
                
                // trunc string
                if(block.val == null) block.val = "";
                block.val = block.val.toString().substring(0, block.length);
                block.val = block.val.padEnd(block.length, " ");   

            }
        )
    
        return structChatlog;
 
    }

    // conversion
    static structChatlogs_to_Chatlogs(_structChatlogs){

        let chatlogs = []; // list of message

        _structChatlogs.forEach(structChatlog => 
            {
                let chatlog = this.structChatlog_to_Chatlog(structChatlog);
                chatlogs.push(chatlog);
            }) 
            
        return chatlogs;
    
    }

}
module.exports = ChatlogStructDTO;