//Util who convert Message to MessageStruct & Versa.
let MessageClass = require("./message.js");
let StructMessageClass = require("./structMessage.js");

const MessageStructDTO = class{

    // conversion
    static structMessage_to_Message(_structMessage){

        let message = new MessageClass();

        _structMessage.Blocks.forEach(block => 
            {
                let val = block.val.trim(); // remove spaces
                switch(block.idBlock){              
                    case 'idMessage': message.idMessage = val; break;
                    case 'version': message.version = val; break;
                    case 'idUser': message.idUser = val; break;
                    case 'isVisible': message.isVisible = val; break;
                    case 'idChatlog': message.idChatlog = val; break;
                    case 'pseudo': message.pseudo = val; break;
                    case 'effect': message.effect = val; break;
                    case 'font': message.font = val; break;
                    case 'color': message.color = val; break;
                    case 'message': message.message = val; break;
                    case 'timestamp': message.timestamp = val; break;
                }
            }
        )
    
        return message;
 
    }

    // conversion
    static Message_to_structMessage(_message){

        let structMessage = new StructMessageClass();

        structMessage.Blocks.forEach(block => 
            {
                switch(block.idBlock){              
                    case 'idMessage': block.val = _message.idMessage; break;
                    case 'version': block.val = _message.version; break;
                    case 'idUser': block.val = _message.idUser; break;
                    case 'isVisible': block.val = _message.isVisible; break;
                    case 'idChatlog': block.val = _message.idChatlog; break;
                    case 'pseudo': block.val = _message.pseudo; break;
                    case 'color': block.val = _message.color; break;
                    case 'effect': block.val = _message.effect; break;
                    case 'font': block.val = _message.font; break;
                    case 'message': block.val = _message.message; break;
                    case 'timestamp': block.val = _message.timestamp; break;
                }
                
                // trunc string
                if(block.val == null) block.val = "";
                block.val = block.val.toString().substring(0, block.length);
                block.val = block.val.padEnd(block.length, " ");   

            }
        )
    
        return structMessage;
 
    }

    // conversion
    static structMessages_to_Messages(_structMessages){

        let messages = []; // list of message

        _structMessages.forEach(structMessage => 
            {
                let message = this.structMessage_to_Message(structMessage);
                messages.push(message);
            })
            
        return messages;
    
    }

}
module.exports = MessageStructDTO;