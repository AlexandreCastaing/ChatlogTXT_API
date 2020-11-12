//Message represent a message.

const Chatlog = class{    
  
    constructor(LAST_ID_CHATLOG, _idUser){
        this.idChatlog = LAST_ID_CHATLOG;

        this.version = process.env.VERS;
        this.idUser = _idUser;
        this.isVisible = process.env.DEFAULT_VISIBLE_CHATLOG; // format "0"/"1"
        this.name = process.env.DEFAULT_NAME_CHATLOG; 
        this.description = process.env.DEFAULT_DESCRIPTION_CHATLOG; 
        this.color = "#"+process.env.DEFAULT_COLOR_CHATLOG; // format "#FFFFFF"
        this.effect = process.env.DEFAULT_EFFECT_CHATLOG;
        this.font = process.env.DEFAULT_FONT_CHATLOG;
        this.icon = process.env.DEFAULT_ICON_CHATLOG;
        this.colorMessages = "#"+process.env.DEFAULT_COLOR_MESSAGE; // format "#FFFFFF"
        this.effectMessages = process.env.DEFAULT_EFFECT_MESSAGE;
        this.fontMessages = process.env.DEFAULT_FONT_MESSAGE;
        this.hasPassword = 0;
        this.password = "";     
        this.timestamp = Date.now();    
    };

    copy(){
        let chatlogCopy = new Chatlog(this.idChatlog, this.idUser);
        chatlogCopy.version = this.version;
        chatlogCopy.idUser = this.idUser;
        chatlogCopy.isVisible = this.isVisible;
        chatlogCopy.name = this.name;
        chatlogCopy.description = this.description;
        chatlogCopy.color = this.color;
        chatlogCopy.effect = this.effect;
        chatlogCopy.font = this.font;
        chatlogCopy.icon = this.icon;
        chatlogCopy.colorMessages = this.colorMessages;
        chatlogCopy.effectMessages = this.effectMessages;
        chatlogCopy.fontMessages = this.fontMessages;
        chatlogCopy.hasPassword = this.hasPassword;
        chatlogCopy.password = this.password;     
        chatlogCopy.timestamp =this.timestamp;  
        return chatlogCopy;  
    }

}
module.exports = Chatlog;