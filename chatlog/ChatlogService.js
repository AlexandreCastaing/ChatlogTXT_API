// Chatlog service 

let MessageClass = require("./Message.js");
let StructMessageClass = require("./StructMessage.js");
let MessageStructM_DTOClass = require("./MessageStructM_DTO.js");
let TextFileClass = require("./TextFile.js");
let JsonClass = require("./Json.js");


let LAST_ID_MESSAGE = 0;

class ChatlogService{    

    constructor(){

        // Text File
        this.TextFile = new TextFileClass(this);

        let structMessage = new StructMessageClass();
        this.sizeTextStructMessage = structMessage.totalLength;

        // find the last id on the file
        LAST_ID_MESSAGE = this.getLastId();
    }

    sendMessage(idUser, isVisible, idChatlog, pseudo, messagetext, color, effect, font){

        let Log_Title = "Send Message";

        try{

            // Make Message
            let message = new MessageClass(++LAST_ID_MESSAGE);
            let isNormalisedMessage = this.makeAndNormalizeMessage(message, idUser, isVisible, idChatlog, pseudo, messagetext, color, effect, font, null, Log_Title);
            if(isNormalisedMessage != true) return isNormalisedMessage;

            // convert to StructMessage
            let structMessage = MessageStructM_DTOClass.Message_to_structMessage(message);

            // insert on file 
            this.TextFile.Write_structMessage_File(structMessage);

            console.log("-message insered id="+message.idMessage+"  (timestamp: "+message.timestamp+")");
            
            // reconvert StructMessage to Message 
            message = MessageStructM_DTOClass.structMessage_to_Message(structMessage);

            // OK 
            return message;

        }catch(e){
            console.log(e);
            return "Err {"+Log_Title+"}. Please see the logs for more details";
        }

    }

    makeAndNormalizeMessage(message, idUser, isVisible, idChatlog, pseudo, messagetext, color, effect, font, timestamp, Log_Title){
        
         // Make Message
         message.version = process.env.VERS;
         if(idUser != null) message.idUser = idUser;
         if(isVisible != null) message.isVisible = isVisible; // format "0"/"1"
         if(idChatlog != null) message.idChatlog = idChatlog;
         if(pseudo != null) message.pseudo = pseudo;
         if(color != null) message.color = color; // format "#FFFFFF"
         if(effect != null) message.effect = effect;
         if(font != null) message.font = font;
         if(messagetext != null) message.message = messagetext;

         message.timestamp = Date.now();    
         if(timestamp!=null)
            message.timestamp = timestamp;    

        // check datas
        return this.normalizeMessage(message, Log_Title);
        
    }

    normalizeMessage(message, Log_Title){
        let warnings = "";

         // Err
         if(message.idUser == null) return "Err "+Log_Title+": idUser must be set";
         //if(message.idChatlog == null) return "Err "+Log_Title+": idChatlog must be set";
         
         // War
         if(message.isVisible == null) warnings += "War {"+Log_Title+"}: isVisible is not set (format '0' or '1'): default value '"+process.env.DEFAULT_VISIBLE_MESSAGE+"'. \n";
         if(message.pseudo == null) warnings += "War {"+Log_Title+"}: Pseudo is not set, default attribution: "+process.env.DEFAULT_PSEUDO+". \n";
         if(message.idChatlog == null) warnings += "War {"+Log_Title+"}: idChatlog is not set, default attribution: "+process.env.DEFAULT_IDCHATLOG+". \n";
         if(message.color == null) warnings += "War {"+Log_Title+"}: Color is not set, default attribution: #"+process.env.DEFAULT_COLOR_MESSAGE+". \n";
         if(message.effect == null) warnings += "War {"+Log_Title+"}: Effect is not set, default attribution: "+process.env.DEFAULT_EFFECT_MESSAGE+". \n";
         if(message.font == null) warnings += "War {"+Log_Title+"}: Font is not set, default attribution: "+process.env.DEFAULT_FONT_MESSAGE+". \n";
         if(message.message == null) warnings += "War {"+Log_Title+"}: No message text. \n";
         if(warnings.length > 0) console.log(warnings);

         return true; // OK
    }

    readMessagesByIdChatlog(_idChatlog){
        return this.readMessages((messages)=>{

            let messagesByIdChatlog = [];
            messages.forEach(message => {
                if(message.idChatlog == _idChatlog)
                messagesByIdChatlog.push(message);
            });

            // sort by timestamp DESC
            messagesByIdChatlog.sort(this.compareIndexFound);
    
            return messagesByIdChatlog;

        });
    }

    readMessages(){
        return this.readMessages((withoutFilterMessages)=>{return withoutFilterMessages;});
    }

    readMessages(_filterMethod){

        let Log_Title = "Read Message";

        let messages = []

        try{

            // Read From File 
            let structMessages = this.TextFile.Read_structMessages_File();

            // convert List StructMessage to List Message
            messages = MessageStructM_DTOClass.structMessages_to_Messages(structMessages);
            
        }catch(e){
            console.log(e);
            return "Err {"+Log_Title+"}. Please see the logs for more details";
        }

        // sort by timestamp DESC
        messages.sort(this.compareIndexFound);

        if(_filterMethod!=null){
            messages = _filterMethod(messages);
        }

        // OK
        return JsonClass.messages(messages);

    }
    compareIndexFound(a, b) {
        if (a.timestamp < b.timestamp) { return 1; }
        if (a.timestamp > b.timestamp) { return -1; }
        return 0;
    }

    changeMessage(_idMessage, isVisible, messagetext, color, effect, font){
        let Log_Title = "Changing Message";

        try{

            if(_idMessage == null) return "Err "+Log_Title+": idMessage must be set";

            // message 
            let messageById = this.getMessageById(_idMessage);

            if(messageById == null){
                console.log("War {"+Log_Title+"}. No message find with the id "+_idMessage+". ");
                return null;
            }
            // convert to StructMessage (we keep the old version for replace it on file)
            let structMessage = MessageStructM_DTOClass.Message_to_structMessage(messageById);

            // copy message
            let messageByIdCopy = messageById.copy();

            // no change for nulls
             messageByIdCopy.isVisible = (isVisible != null) ? isVisible : messageById.isVisible;
             messageByIdCopy.message = (messagetext != null) ? messagetext : messageById.message;
             messageByIdCopy.color = (color != null) ? color : messageById.color;
             messageByIdCopy.effect = (effect != null) ? effect : messageById.effect;
             messageByIdCopy.font = (font != null) ? font : messageById.font;
            
            let isNormalisedMessage = this.normalizeMessage(messageByIdCopy, Log_Title);
            if(isNormalisedMessage != true) return isNormalisedMessage;

            // convert the new to StructMessage
            let structMessageCopy = MessageStructM_DTOClass.Message_to_structMessage(messageByIdCopy);

            // replace on file 
            let hasNoError = this.TextFile.Replace_structMessage_File(structMessage, structMessageCopy);

            if(hasNoError)
                console.log("-message values replaced id="+messageById.idMessage+"");
            else
                return console.log("Err {"+Log_Title+"}. Internal Error x_o.");
            
            // reconvert StructMessage to Message 
            messageById = MessageStructM_DTOClass.structMessage_to_Message(structMessageCopy);

            // OK 
            return messageById;


        }catch(e){
            console.log(e);
            return "Err {"+Log_Title+"}. Please see the logs for more details";
        }
    }

    getLastId(){

        let maxId = 0;
        let messages = []

        messages = this.getMessages();

        if(messages.length == 0 ) {
            console.log("no message, first message will have id = "+maxId);
            return maxId;
        }

        // shearch
        messages.forEach(message => {
            maxId = Math.max(message.idMessage, maxId); 
        }); 

        console.log("last id message finded = "+maxId);

        return maxId;
        
    }

    getMessageById(_id){

        let messages = []

        messages = this.getMessages();



        if(messages.length == 0 ) {
            return null;
        }

        let messageR = null;
        
        // shearch
        messages.forEach(message => {
            if(message.idMessage == _id){
                messageR = message; 
            }
        }); 

        return messageR;
      
    }

    getMessages(){
        
        let Log_Title = "Getting Messages";

        let messages = []

        try{

            // Read From File 
            let structMessages = this.TextFile.Read_structMessages_File();

            // convert List StructMessage to List Message
            messages = MessageStructM_DTOClass.structMessages_to_Messages(structMessages);
            
        }catch(e){
            console.log("Err {"+Log_Title+"}. Can't get messages...");
        }

        return messages;
        
    }

    deleteMessage(_idMessage){
        let Log_Title = "Deleting Message";

        try{

            if(_idMessage == null) return "Err "+Log_Title+": idMessage must be set";

            // message 
            let messageById = this.getMessageById(_idMessage);

            if(messageById == null){
                console.log("War {"+Log_Title+"}. No message find with the id "+_idMessage+". ");
                return null;
            }
            // convert to StructMessage (we will replace datas by empty value)
            let structMessage = MessageStructM_DTOClass.Message_to_structMessage(messageById);

            //convert to DataFile 
            let dataToRemove = this.TextFile.structMessageToDataFile(structMessage);

            // replace on file 
            let hasNoError = this.TextFile.replaceOnFile(dataToRemove, "");
            if(hasNoError)
                console.log("-message deleted id="+messageById.idMessage+"");
            else
                return console.log("Err {"+Log_Title+"}. Internal Error x_o.");
            
            // OK 
            return messageById;

        }catch(e){
            console.log(e);
            return "Err {"+Log_Title+"}. Please see the logs for more details";
        }
    }

    readMessageById(_idMessage){
        let Log_Title = "Deleting Message";

        try{

            if(_idMessage == null) return "Err "+Log_Title+": idMessage must be set";

            // message 
            let messageById = this.getMessageById(_idMessage);

            if(messageById == null){
                console.log("War {"+Log_Title+"}. No message find with the id "+_idMessage+". ");
                return null;
            }
            // OK 
            return messageById;

        }catch(e){
            console.log(e);
            return "Err {"+Log_Title+"}. Please see the logs for more details";
        }
    }
    
    readMessageById_Last_Timestamp_Mode(idMessage){ 
        
        return this.readMessages((messages)=>{

            let messagesById = [];
            messages.forEach(message => {
                if(message.idMessage == idMessage)
                    messagesById.push(message);
            });

            // sort by timestamp DESC (we want the most recent id)
            messages.sort(this.compareIndexFound);

            return messagesById;

        })[0];
    }
};

module.exports = ChatlogService;