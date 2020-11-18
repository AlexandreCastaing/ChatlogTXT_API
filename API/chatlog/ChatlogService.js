// Chatlog service 

let MessageClass = require("./message.js");
let ChatlogClass = require("./chatlog.js");
let StructMessageClass = require("./structMessage.js");
let StructChatlogClass = require("./structChatlog.js");
let MessageStructM_DTOClass = require("./messageStructM_DTO.js");
let ChatlogStructC_DTOClass = require("./chatlogStructC_DTO.js");
let TextFileClass = require("./textFile.js");
let JsonClass = require("./json.js");
const StructChatlog = require("./structChatlog.js");
const Json = require("./json.js");

let LAST_ID_MESSAGE = 0;
let LAST_ID_CHATLOG = 0;

class ChatlogService{    

    constructor(){

        // Text Files
        this.TextFileMessage = new TextFileClass(this, process.env.TXT_FILE_MESSAGES, "Message");
        this.TextFileChatlog = new TextFileClass(this, process.env.TXT_FILE_CHATLOGS, "Chatlog");

        let structMessage = new StructMessageClass();
        let structChatlog = new StructChatlogClass();
        
        this.sizeTextStructMessage = structMessage.totalLength;
        this.sizeTextStructChatlog = structChatlog.totalLength;

        // find the last id on the file
        LAST_ID_MESSAGE = this.getLastIdMessage();
        LAST_ID_CHATLOG = this.getLastIdChatlog();
        
    }

    checkPassword(_idChatlog, _password, Log_Title){
        
        if(_idChatlog == null) return null;

        let chatlogById = this.getChatlogById(_idChatlog);

        let hasPassword = ()=>{ // convert into bool
        switch(chatlogById.hasPassword.toLowerCase().trim())
            {
                case 'true':
                case true:    
                case "yes":
                case 1:   
                case '1':
                return true;
                case 'false':
                case false:
                case "no":
                case 0:
                case '0':
                case null:
                case 'null':
                case "":
                return false;
                default:
                return true;
            }
        }

        if(hasPassword() == true){
            if(_password != chatlogById.password){
                console.log("Err {"+Log_Title+"}. Bad password.")
                return false;
            }
        }
        return true;
    }

    sendMessage(_idUser, _isVisible, _idChatlog, _pseudo, _messagetext, _color, _effect, _font, _password, _nameChatlog){

        let Log_Title = "Send Message";

        try{

            // idChatlog missing, shearch by name.
            let checkIdName = this.check_ById_orByName_Chatlog(_idChatlog, _nameChatlog, Log_Title);
            if(checkIdName.checking != true) return checkIdName;
            _idChatlog = checkIdName.idChatlog;

            let chatlogById = this.getChatlogById(_idChatlog);
            if(chatlogById==null) return;  

            // chk password
            if(_idUser != chatlogById.idUser)
                if(!this.checkPassword(_idChatlog, _password, Log_Title)) return "Bad Password";
            
            
            // Make Message
            let message = new MessageClass(++LAST_ID_MESSAGE);
            let isNormalisedMessage = this.makeAndNormalizeMessage(message, _idUser, _isVisible, _idChatlog, _pseudo, _messagetext, _color, _effect, _font, null, Log_Title);
            if(isNormalisedMessage != true) return "Err {"+Log_Title+"}. Please see the logs for more details (normalizeMessage).";

            // convert to StructMessage
            let structMessage = MessageStructM_DTOClass.Message_to_structMessage(message);

            // insert on file 
            this.TextFileMessage.Write_struct_File(structMessage);

            console.log("-message insered id="+message.idMessage+"  (timestamp: "+message.timestamp+")");
            
            // reconvert StructMessage to Message 
            message = MessageStructM_DTOClass.structMessage_to_Message(structMessage);

            // OK 
            return JsonClass.message(message);

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
         if(message.idChatlog == null) return "Err "+Log_Title+": idChatlog must be set";
         
         // War
         if(message.isVisible == null) warnings += "War {"+Log_Title+"}: isVisible is not set (format '0' or '1'): default value '"+process.env.DEFAULT_VISIBLE_MESSAGE+"'. \n";
         if(message.pseudo == null) warnings += "War {"+Log_Title+"}: Pseudo is not set, default attribution: "+process.env.DEFAULT_PSEUDO+". \n";
         if(message.color == null) warnings += "War {"+Log_Title+"}: Color is not set, default attribution: #"+process.env.DEFAULT_COLOR_MESSAGE+". \n";
         if(message.effect == null) warnings += "War {"+Log_Title+"}: Effect is not set, default attribution: "+process.env.DEFAULT_EFFECT_MESSAGE+". \n";
         if(message.font == null) warnings += "War {"+Log_Title+"}: Font is not set, default attribution: "+process.env.DEFAULT_FONT_MESSAGE+". \n";
         if(message.message == null) warnings += "War {"+Log_Title+"}: No message text. \n";
         if(warnings.length > 0) console.log(warnings);

         return true; // OK
    }

    readMessagesByIdChatlog(_idChatlog, _password, _nameChatlog){

        let Log_Title = "Read Messages By Id";

        let checkError = false;
        let infoError = "";

        let toReturn = this.readMessages((messages)=>{

            // idChatlog missing, shearch by name.
            let checkIdName = this.check_ById_orByName_Chatlog(_idChatlog, _nameChatlog, Log_Title);
            if(checkIdName.checking != true){
                infoError = checkIdName;
                checkError=true; 
                return null;
            }   
            _idChatlog = checkIdName.idChatlog;

            let chatlogById = this.getChatlogById(_idChatlog);
            if(chatlogById==null) return [];  

             // check Password
            if(!this.checkPassword(_idChatlog, _password, Log_Title)){
                infoError = "Err {"+Log_Title+"}. Bad Password.";
                checkError=true; 
                return null;
            }

            let messagesByIdChatlog = [];
            messages.forEach(message => {
                if(message.idChatlog == _idChatlog)
                messagesByIdChatlog.push(message);
            });

            // sort by timestamp DESC
            messagesByIdChatlog.sort(this.compareIndexFound_timestamp);
    
            return JsonClass.messages(messagesByIdChatlog);

        });

        if(checkError) {
            return infoError;
        }
        return toReturn;
    }

    readMessages(){
        return this.readMessages((withoutFilterMessages)=>{return withoutFilterMessages;});
    }

    readMessages(_filterMethod){

        let Log_Title = "Read Message";

        let messages = []

        try{

            // Read From File 
            let structMessages = this.TextFileMessage.Read_struct_File();

            // convert List StructMessage to List Message
            messages = MessageStructM_DTOClass.structMessages_to_Messages(structMessages);
            
        }catch(e){
            console.log(e);
            return "Err {"+Log_Title+"}. Please see the logs for more details";
        }

        // sort by timestamp DESC
        messages.sort(this.compareIndexFound_timestamp);

        if(_filterMethod!=null){
            messages = _filterMethod(messages);
        }

        // OK
        return messages;

    }
    compareIndexFound_timestamp(a, b) {
        if (a.timestamp < b.timestamp) { return 1; }
        if (a.timestamp > b.timestamp) { return -1; }
        return 0;
    }
      
    check_ById_orByName_Chatlog(_idChatlog, _nameChatlog, Log_Title){
        if(_idChatlog == null) _idChatlog = this.getLastIdChatlogByNameChatlog(_nameChatlog);
        if(_idChatlog == null) 
            if(_nameChatlog == null) 
                return "Err {"+Log_Title+"}: idChatlog or nameChatlog must be set"; 
            else return "Err {"+Log_Title+"}: No chatlog '"+_nameChatlog+"' exists."; 
        return {checking:true, idChatlog: _idChatlog};
     }

    changeMessage(_idMessage, isVisible, messagetext, color, effect, font, idChatlog, idUser, _password, _nameChatlog){
        let Log_Title = "Changing Message";

        try{

            if(_idMessage == null) return "Err {"+Log_Title+"}: idMessage must be set";
            
             // idChatlog missing, shearch by name.
             let checkIdName = this.check_ById_orByName_Chatlog(idChatlog, _nameChatlog, Log_Title);
             if(checkIdName.checking != true) return checkIdName;
             idChatlog = checkIdName.idChatlog;
       

            let chatlogById = this.getChatlogById(idChatlog);
            if(chatlogById==null) return;  

            // check password
            if(idUser != chatlogById.idUser)
                if(!this.checkPassword(idChatlog, _password, Log_Title)) return "Bad Password";


            // message 
            let messageById = this.getMessageById(_idMessage);

            if(messageById == null){
                return "Err {"+Log_Title+"}. No message find with the id "+_idMessage+". ";
            }

            // check message is from the user
            if(idUser != messageById.idUser){
                return "Err {"+Log_Title+"}. Bad user. ";
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
            let hasNoError = this.TextFileMessage.Replace_struct_File(structMessage, structMessageCopy);

            if(hasNoError)
                console.log("-message values replaced id="+messageById.idMessage+"");
            else
                return "Err {"+Log_Title+"}. Internal Error x_o.";
            
            // reconvert StructMessage to Message 
            messageById = MessageStructM_DTOClass.structMessage_to_Message(structMessageCopy);

            // OK 
            return JsonClass.message(messageById);


        }catch(e){
            console.log(e);
            return "Err {"+Log_Title+"}. Please see the logs for more details";
        }
    }

    getLastIdMessage(){

        let maxId = 0;
        let messages = []

        messages = this.getMessages();

        if(messages.length == 0 ) {
            console.log("> no message on file, first message will have id = "+maxId);
            return maxId;
        }

        // shearch
        messages.forEach(message => {
            if(!isNaN(message.idMessage) && message.idMessage.length > 0)
                maxId = Math.max(message.idMessage, maxId); 
        }); 

        console.log("> last id message finded = "+maxId);

        return maxId;
        
    }

    getLastIdChatlog(){

        let maxId = 0;
        let chatlogs = []

        chatlogs = this.getChatlogs();

        if(chatlogs.length == 0 ) {
            console.log("> no chatlog on file, first chatlog will have id = "+maxId);
            return maxId;
        }

        // shearch
        chatlogs.forEach(c => {
            if(!isNaN(c.idChatlog) && c.idChatlog.length > 0) 
                maxId = Math.max(c.idChatlog, maxId); 
        }); 

        console.log("> last id chatlog finded = "+maxId);

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
            let structMessages = this.TextFileMessage.Read_struct_File();

            // convert List StructMessage to List Message
            messages = MessageStructM_DTOClass.structMessages_to_Messages(structMessages);
            
        }catch(e){
            console.log(e);
            return "Err {"+Log_Title+"}. Can't get messages.";
        }

        return messages;
        
    }

    deleteMessage(_idMessage,idChatlog,idUser,_password,_nameChatlog){
        let Log_Title = "Deleting Message";

        try{

            if(_idMessage == null) return "Err {"+Log_Title+"}: idMessage must be set";
            
            // idChatlog missing, shearch by name.
            let checkIdName = this.check_ById_orByName_Chatlog(idChatlog, _nameChatlog, Log_Title);
            if(checkIdName.checking != true) return checkIdName;
            idChatlog = checkIdName.idChatlog;

            let chatlogById = this.getChatlogById(idChatlog);
            if(chatlogById==null) return;  

            // check password
            if(idUser != chatlogById.idUser)
                if(!this.checkPassword(idChatlog, _password, Log_Title)) return "Bad Password"


            // message 
            let messageById = this.getMessageById(_idMessage);

            if(messageById == null){
                return "Err {"+Log_Title+"}. No message find with the id "+_idMessage+". ";
            }

            // check message is from the user
            if(idUser != messageById.idUser){
                return "Err {"+Log_Title+"}. Bad user. ";
            }

            // convert to StructMessage (we will replace datas by empty value)
            let structMessage = MessageStructM_DTOClass.Message_to_structMessage(messageById);

            //convert to DataFile 
            let dataToRemove = this.TextFileMessage.structToDataFile(structMessage);

            // replace on file 
            let hasNoError = this.TextFileMessage.replaceOnFile(dataToRemove, "");
            if(hasNoError)
                console.log("-message deleted id="+messageById.idMessage+"");
            else
                return "Err {"+Log_Title+"}. Internal Error x_o.";
            
            // OK 
            return JsonClass.message(messageById);

        }catch(e){
            console.log(e);
            return "Err {"+Log_Title+"}. Please see the logs for more details";
        }
    }

    readMessageById(_idMessage, _idChatlog, _password, _nameChatlog){
        let Log_Title = "Reading Message";

        try{

            if(_idMessage == null) return "Err {"+Log_Title+"}: idMessage must be set";
            
            // idChatlog missing, shearch by name.
            let checkIdName = this.check_ById_orByName_Chatlog(_idChatlog, _nameChatlog, Log_Title);
            if(checkIdName.checking != true) return checkIdName;
            _idChatlog = checkIdName.idChatlog;

            let chatlogById = this.getChatlogById(_idChatlog);
            if(chatlogById==null) return;  

             // check Password
             //if(idUser != chatlogById.idUser)
            if(!this.checkPassword(_idChatlog, _password, Log_Title)) return "Bad Password";


            // message 
            let messageById = this.getMessageById(_idMessage);

            if(messageById == null){
                return "Err {"+Log_Title+"}. No message find with the id "+_idMessage+". ";
            }
            // OK 
            return JsonClass.message( messageById );

        }catch(e){
            console.log(e);
            return "Err {"+Log_Title+"}. Please see the logs for more details";
        }
    }

    deleteChatlog(_idChatlog, idUser,_nameChatlog){
        let Log_Title = "Deleting Chatlog";

        try{

            // idChatlog missing, shearch by name.
            let checkIdName = this.check_ById_orByName_Chatlog(_idChatlog, _nameChatlog, Log_Title);
            if(checkIdName.checking != true) return checkIdName;
            _idChatlog = checkIdName.idChatlog;

            // chatlog 
            let chatlogById = this.getChatlogById(_idChatlog);

            if(chatlogById == null){
                return "Err {"+Log_Title+"}. No chatlog find with the id "+_idChatlog+". ";
            }

            // check if good user
            if(idUser != chatlogById.idUser){
                return "Err {"+Log_Title+"}. Bad User. ";
            }
            
            // convert to StructChatlog (we will replace datas by empty value)
            let structChatlog = ChatlogStructC_DTOClass.Chatlog_to_structChatlog(chatlogById);

            //convert to DataFile 
            let dataToRemove = this.TextFileChatlog.structToDataFile(structChatlog);

            // replace on file 
            let hasNoError = this.TextFileChatlog.replaceOnFile(dataToRemove, "");
            if(hasNoError)
                console.log("-chatlog deleted id="+chatlogById.idChatlog+"");
            else
                return "Err {"+Log_Title+"}. Internal Error x_o.";
            
            // OK 
            return JsonClass.chatlog(chatlogById);

        }catch(e){
            console.log(e);
            return "Err {"+Log_Title+"}. Please see the logs for more details";
        }
    }

    sendChatlog( idChatlog,hasPassword,password,idUser,isVisible,nameChatog,description,color,effect,font,icon,colorMessages,effectMessages,fontMessages){

        let Log_Title = "Send Chatlog";

        try{

            // Make Chatlog
            let chatlog = new ChatlogClass(++LAST_ID_CHATLOG);
            idChatlog = chatlog.idChatlog;

            let isNormalisedChatlog = this.makeAndNormalizeChatlog(chatlog, idChatlog,hasPassword,password,idUser,isVisible,nameChatog,description,color,effect,font,icon,colorMessages,effectMessages,fontMessages,Log_Title, null);
            if(isNormalisedChatlog != true) return isNormalisedChatlog;

            // convert to StructChatlog
            let structChatlog = ChatlogStructC_DTOClass.Chatlog_to_structChatlog(chatlog);

            // insert on file 
            this.TextFileChatlog.Write_struct_File(structChatlog);

            console.log("-chatlog insered id="+chatlog.idChatlog+"  (timestamp: "+chatlog.timestamp+")");
            
            // reconvert StructChatlog to Chatlog
            chatlog = ChatlogStructC_DTOClass.structChatlog_to_Chatlog(structChatlog);

            // OK 
            return JsonClass.chatlog(chatlog);

        }catch(e){
            console.log(e);
            return "Err {"+Log_Title+"}. Please see the logs for more details";
        }

    }

    getChatlogs(){

        let Log_Title = "Getting Chatlogs";

        let chatlogs = []

        try{

            // Read From File 
            let structChatlogs = this.TextFileChatlog.Read_struct_File();
            // convert List StructMessage to List Message
            chatlogs = ChatlogStructC_DTOClass.structChatlogs_to_Chatlogs(structChatlogs);
            
        }catch(e){
            console.log(e);
            
            return "Err {"+Log_Title+"}. Can't get chatlogs.";
        }

        return chatlogs;
    }

    readChatlogs(){
        let Log_Title = "Reading Chatlogs";
        try{
            return JsonClass.chatlogs(this.getChatlogs());
        }catch(e){
            console.log(e);    
            return "Err {"+Log_Title+"}. Can't get chatlogs (json convert).";
        }
    }

    readChatlogById(_idChatlog, _nameChatlog){
        let Log_Title = "Reading Chatlog";


        try{

            // idChatlog missing, shearch by name.
            let checkIdName = this.check_ById_orByName_Chatlog(_idChatlog, _nameChatlog, Log_Title);
            if(checkIdName.checking != true) return checkIdName;
            _idChatlog = checkIdName.idChatlog;

            // chatlog
            let chatlogById = this.getChatlogById(_idChatlog);

            if(chatlogById == null){
                return "Err {"+Log_Title+"}. No chatlog find with the id "+_idChatlog+". ";
            }

            // OK 
            return JsonClass.chatlog(chatlogById);

        }catch(e){
            console.log(e);
            return "Err {"+Log_Title+"}. Please see the logs for more details";
        }
    }

    getChatlogById(_idChatlog){


        if(_idChatlog == null) return;

        let chatlogs = []

        chatlogs = this.getChatlogs();

        if(chatlogs.length == 0 ) {
            return null;
        }

        let chatlogR = null;
        
        // shearch
        chatlogs.forEach(chatlog => {
            if(chatlog.idChatlog == _idChatlog){
                chatlogR = chatlog; 
            }
        }); 

        return chatlogR;

    }

    changeChatlog(_idChatlog,hasPassword,password,_idUser,isVisible,name,description,color,effect,font,icon,colorMessages,effectMessages,fontMessages){
        let Log_Title = "Changing Chatlog";

        try{

            // idChatlog missing, shearch by name.
            let checkIdName = this.check_ById_orByName_Chatlog(_idChatlog, name, Log_Title);
            if(checkIdName.checking != true) return checkIdName;
            _idChatlog = checkIdName.idChatlog;

            // chatlog 
            let chatlogById = this.getChatlogById(_idChatlog);

            if(chatlogById == null){
                return "Err {"+Log_Title+"}. No chatlog find with the id "+_idChatlog+". ";
            }

        
            // check if good user
            if(_idUser != chatlogById.idUser){
                return "Err {"+Log_Title+"}. Bad User. ";
            }

            // convert to StructChatlog (we keep the old version for replace it on file)
            let structChatlog = ChatlogStructC_DTOClass.Chatlog_to_structChatlog(chatlogById);

            // copy chatlog
            let chatlogByIdCopy = chatlogById.copy();

            // no change for nulls
             chatlogByIdCopy.isVisible = (isVisible != null) ? isVisible : chatlogById.isVisible;
             chatlogByIdCopy.color = (color != null) ? color : chatlogById.color;
             chatlogByIdCopy.effect = (effect != null) ? effect : chatlogById.effect;
             chatlogByIdCopy.font = (font != null) ? font : chatlogById.font;
             chatlogByIdCopy.icon = (icon != null) ? icon : chatlogById.icon;
             chatlogByIdCopy.description = (description != null) ? description : chatlogById.description;
             chatlogByIdCopy.colorMessages = (colorMessages != null) ? colorMessages : chatlogById.colorMessages;
             chatlogByIdCopy.effectMessages = (effectMessages != null) ? effectMessages : chatlogById.effectMessages;
             chatlogByIdCopy.fontMessages = (fontMessages != null) ? fontMessages : chatlogById.fontMessages;
             chatlogByIdCopy.name = (name != null) ? name : chatlogById.name;
             chatlogByIdCopy.hasPassword = (hasPassword != null) ? hasPassword : chatlogById.hasPassword;
             chatlogByIdCopy.password = (password != null) ? password : chatlogById.password;
            
            let isNormalisedChatlog = this.normalizeChatlog(chatlogByIdCopy, Log_Title);
            if(isNormalisedChatlog != true) return isNormalisedChatlog;

            // convert the new to StructChatlog
            let structChatlogCopy = ChatlogStructC_DTOClass.Chatlog_to_structChatlog(chatlogByIdCopy);

            // replace on file 
            let hasNoError = this.TextFileChatlog.Replace_struct_File(structChatlog, structChatlogCopy);

            if(hasNoError)
                console.log("-chatlog values replaced id="+chatlogById.idChatlog+"");
            else
                return "Err {"+Log_Title+"}. Internal Error x_o.";
            
            // reconvert StructChatlog to Chatlog
            chatlogById = ChatlogStructC_DTOClass.structChatlog_to_Chatlog(structChatlogCopy);

            // OK 
            return JsonClass.chatlog(chatlogById);


        }catch(e){
            console.log(e);
            return "Err {"+Log_Title+"}. Please see the logs for more details";
        }
    }

    makeAndNormalizeChatlog(chatlog, idChatlog,hasPassword,password,idUser,isVisible,nameC,description,color,effect,font,icon,colorMessages,effectMessages,fontMessages, Log_Title, timestamp){

        // Make Message
        chatlog.version = process.env.VERS;
        if(idChatlog != null) chatlog.idChatlog = idChatlog;
        if(hasPassword != null) chatlog.hasPassword = hasPassword;
        if(password != null) chatlog.password = password;
        if(idUser != null) chatlog.idUser = idUser;
        if(isVisible != null) chatlog.isVisible = isVisible; // format "0"/"1"
        if(nameC != null) chatlog.name = nameC;
        if(description != null) chatlog.description = description;
        if(color != null) chatlog.color = color; // format "#FFFFFF"
        if(effect != null) chatlog.effect = effect;
        if(font != null) chatlog.font = font;
        if(icon != null) chatlog.icon = icon;
        if(colorMessages != null) chatlog.colorMessages = colorMessages; // format "#FFFFFF"
        if(effectMessages != null) chatlog.effectMessages = effectMessages;
        if(fontMessages != null) chatlog.fontMessages = fontMessages;
       
        chatlog.timestamp = Date.now();    
        if(timestamp!=null)
            chatlog.timestamp = timestamp;    

       // check datas
       return this.normalizeChatlog(chatlog, Log_Title);
       
   }

   normalizeChatlog(chatlog, Log_Title){
       let warnings = "";

        // Err
        if(chatlog.idUser == null) return "Err {"+Log_Title+"}: idUser must be set";
        
        if(chatlog.idChatlog == null) return "Err {"+Log_Title+"}: idChatlog must be set";
        
        // War
        if(chatlog.name == null) warnings += "War {"+Log_Title+"}: name is not set: default value '"+process.env.DEFAULT_NAME_CHATLOG+"'. \n";
        if(chatlog.description == null) warnings += "War {"+Log_Title+"}: description is not set: default value '"+process.env.DEFAULT_DESCRIPTION_CHATLOG+"'. \n";
        if(chatlog.color == null) warnings += "War {"+Log_Title+"}: color is not set: default value '"+process.env.DEFAULT_COLOR_CHATLOG+"'. \n";
        if(chatlog.font == null) warnings += "War {"+Log_Title+"}: font is not set: default value '"+process.env.DEFAULT_FONT_CHATLOG+"'. \n";
        if(chatlog.effect == null) warnings += "War {"+Log_Title+"}: effect is not set: default value '"+process.env.DEFAULT_EFFECT_CHATLOG+"'. \n";
        if(chatlog.icon == null) warnings += "War {"+Log_Title+"}: icon is not set: default value '"+process.env.DEFAULT_ICON_CHATLOG+"'. \n";
        if(chatlog.colorMessages == null) warnings += "War {"+Log_Title+"}: colorMessages is not set: default value '"+process.env.DEFAULT_COLOR_MESSAGE+"'. \n";
        if(chatlog.fontMessages == null) warnings += "War {"+Log_Title+"}: fontMessages is not set: default value '"+process.env.DEFAULT_FONT_MESSAGE+"'. \n";
        if(chatlog.effectMessages == null) warnings += "War {"+Log_Title+"}: effectMessages is not set: default value '"+process.env.DEFAULT_EFFECT_MESSAGE+"'. \n";
        
        if(warnings.length > 0) console.log(warnings);

        return true; // OK
   }

   getChatlogsByNameChatlog(_name){
        let Log_Title = "Get Chatlog By Name";

        let chatlogs = []

        chatlogs = this.getChatlogs();

        if(chatlogs.length == 0 ) {
            console.log("War {"+Log_Title+"}: No Chatlog.");
            return [];
        }

        let chatlogsByNameChatlog = [];
        chatlogs.forEach(c => {
            if(c.name == _name)
            chatlogsByNameChatlog.push(c);
        });

        // sort by timestamp DESC
        chatlogs.sort(this.compareIndexFound_timestamp);
    
        return chatlogsByNameChatlog;
   }

   getLastIdChatlogByNameChatlog(_name){
        let chatlogs=this.getChatlogsByNameChatlog(_name);
        
        
        if(chatlogs.length > 0)
            return chatlogs[chatlogs.length-1].idChatlog;  //chatlogs[chatlogs.length-1].idChatlog 
        else
            return null;
   }

};

module.exports = ChatlogService;