
class Json{    
    constructor(){}

    static message(message){
        if(message==null) return null;
        if (typeof message === 'string') return message;
        return ( 
            {
                idMessage: message.idMessage,
                //version: message.version,
                idUser: message.idUser,
                isVisible: message.isVisible,
                idChatlog: message.idChatlog,
                pseudo: message.pseudo,
                color: message.color,
                effect: message.effect,
                font: message.font,
                message: message.message,
                //timestamp: message.timestamp,       
            }
        )
    }

    static messages(_messages){
        let msgs_json = [];
        if(_messages==null) return [];
        if (typeof _messages === 'string') return _messages;

        if(_messages.length > 0){
            
            _messages.forEach(message => {
                msgs_json.push(this.message(message))
            });
            return msgs_json;
        }
        else
            return [];
    }

    static chatlog(chatlog){
        if(chatlog==null) return null;
        if (typeof chatlog === 'string') return chatlog;
        return (
            {
                idChatlog: chatlog.idChatlog,
                //version: 
                idUser: chatlog.idUser,
                isVisible: chatlog.isVisible,
                name: chatlog.name,
                description: chatlog.description,
                color: chatlog.color,
                effect: chatlog.effect,
                font: chatlog.font,
                icon: chatlog.icon,
                colorMessages: chatlog.colorMessages,
                effectMessages: chatlog.effectMessages,
                fontMessages: chatlog.fontMessages,
                hasPassword: chatlog.hasPassword,
                //password: 
                //timestamp
            }
        )
    }

    static chatlogs(_chatlogs){
        let chtlgs_json = [];
        if(_chatlogs==null) return [];
        if (typeof _chatlogs === 'string') return _chatlogs;

        if(_chatlogs.length > 0){
            
            _chatlogs.forEach(chatlog => {
                chtlgs_json.push(this.chatlog(chatlog))
            });
            return chtlgs_json;
        }
        else
            return [];
    }
    
}

module.exports = Json;