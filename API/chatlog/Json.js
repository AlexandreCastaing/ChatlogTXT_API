
class Json{    
    constructor(){}

    static message(message){
        if(message==null) return null;
        return ( 
            {
                idMessage: message.idMessage,
                version: message.version,
                idUser: message.idUser,
                isVisible: message.isVisible,
                idChatlog: message.idChatlog,
                pseudo: message.pseudo,
                color: message.color,
                effect: message.effect,
                font: message.font,
                message: message.message,
                timestamp: message.timestamp,       
            }
        )
    }

    static messages(_messages){
        let msgs_json = [];
        if(_messages==null) return [];

        if(_messages.length > 0){
            
            _messages.forEach(message => {
                msgs_json.push(this.message(message))
            });
            return msgs_json;
        }
        else
            return [];
    }

    
}

module.exports = Json;