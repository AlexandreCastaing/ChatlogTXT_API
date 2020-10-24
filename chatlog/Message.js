//Message represent a message.

const Message = class{    
  
    constructor(LAST_ID_MESSAGE){
        this.idMessage = LAST_ID_MESSAGE;

        this.version = process.env.VERS;
        this.idUser = "";
        this.isVisible = process.env.DEFAULT_VISIBLE_MESSAGE; // format "0"/"1"
        this.idChatlog = process.env.DEFAULT_IDCHATLOG;
        this.pseudo = process.env.DEFAULT_PSEUDO;
        this.color = "#"+process.env.DEFAULT_COLOR_MESSAGE; // format "#FFFFFF"
        this.effect = process.env.DEFAULT_EFFECT_MESSAGE;
        this.font = process.env.DEFAULT_FONT_MESSAGE;
        this.message = "";
        this.timestamp = Date.now();    
    };

    copy(){
        let messageCopy = new Message(this.idMessage);
        messageCopy.version =this.version;
        messageCopy.idUser =this.idUser;
        messageCopy.isVisible =this.isVisible;
        messageCopy.idChatlog =this.idChatlog;
        messageCopy.pseudo =this.pseudo;
        messageCopy.color =this.color;
        messageCopy.effect =this.effect;
        messageCopy.font =this.font;
        messageCopy.message =this.message;
        messageCopy.timestamp =this.timestamp;  
        return messageCopy;  
    }

}
module.exports = Message;