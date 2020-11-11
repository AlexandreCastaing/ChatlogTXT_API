
class Json{    
    constructor(){}

    static message(message){
        if(message==null) return null;
        return ( //console.log
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
        if(_messages==null) return null;
        _messages.forEach(message => {
            msgs_json.push(this.message(message))
        });
        return msgs_json;
    }

    
}

module.exports = Json;