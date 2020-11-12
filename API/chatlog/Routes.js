const Routes = class{    

    constructor(app, _chatlogService, _bodyParser){
        
        // create application/json parser
        let jsonParser = _bodyParser.json();

        let pstClr = (bc)=>bc.indexOf("#")>=0?bc:'#'+bc

        // SEND MESSAGE         idUser* , idChatlog* || nameChatlog* , isVisible , message , color , effect , font , pseudo , password 
        app.post('/Message', jsonParser, (req,res) => {
            let body = req.body;
            if(body != null) 
                res.send( _chatlogService.sendMessage(
                    body.idUser, body.isVisible, body.idChatlog, body.pseudo, body.message, pstClr(body.color), body.effect, body.font, body.password, body.nameChatlog )         
                ) 
            else 
                res.status(500).send("Err: No Data Set.");
        })

        // GET MESSAGES         idChatlog* || nameChatlog* , password
        app.get('/Messages', jsonParser, (req,res) => {
            let body = req.query; 
            if(body != null)
                res.send(_chatlogService.readMessagesByIdChatlog(body.idChatlog, body.password, body.nameChatlog));
            else
                res.status(400).send("Err: No Data Set.");
        })

        // GET MESSAGE         idMessage* , idChatlog* || nameChatlog* , password
        app.get('/Message', jsonParser, (req,res) => {
            let body = req.query; 
            if(body != null)
                res.send(_chatlogService.readMessageById(body.idMessage, body.idChatlog, body.password, body.nameChatlog));
            else
                res.status(400).send("Err: No Data Set.");
        })

        // UPDATE MESSAGE       idMessage* , idChatlog* || nameChatlog*, idUser* , password  , isVisible , message , color , effect , font
        app.patch('/Message', jsonParser, (req,res) => {
            let body = req.body;
            if(body != null) 
                res.send(_chatlogService.changeMessage(body.idMessage, body.isVisible, body.message, pstClr(body.color), body.effect, body.font, body.idChatlog, body.idUser, body.password, body.nameChatlog) );
            else 
                res.status(500).send("Err: No Data Set.");
        })

        // DELETE MESSAGE       idMessage* , idChatlog* || nameChatlog*, idUser* , password 
        app.delete('/Message', jsonParser, (req,res) => {
            let body = req.body;
            if(body != null) 
                res.send(_chatlogService.deleteMessage(body.idMessage, body.idChatlog, body.idUser, body.password, body.nameChatlog) );
            else 
                res.status(500).send("Err: No Data Set.");
        })


        // v2020-11-10

        // SEND CHATLOG         idChatlog* || nameChatlog* , idUser* , hasPassword , password , isVisible , name , description , color , effect , font , icon , 
        //                      colorMessages , effectMessages , fontMessages  
        app.post('/Chatlog', jsonParser, (req,res) => {
            let body = req.body;         
            
            if(body != null) 
                res.send( _chatlogService.sendChatlog(
                    null, // body.idChatlog,
                    body.hasPassword,
                    body.password,
                    body.idUser,
                    body.isVisible,
                    body.name,
                    body.description,
                    pstClr(body.color),
                    body.effect,
                    body.font,
                    body.icon,
                    pstClr(body.colorMessages),
                    body.effectMessages,
                    body.fontMessages
                    )
                )
            else 
                res.status(500).send("Err: No Data Set.");
        })

        // GET CHATLOGS         
        app.get('/Chatlogs', jsonParser, (req,res) => {
            res.send(_chatlogService.getChatlogs());
        })

        // GET CHATLOG          idChatlog* || nameChatlog* 
        app.get('/Chatlog', jsonParser, (req,res) => {
            let body = req.query;

            if(body!=null)
                res.send(_chatlogService.readChatlogById(body.idChatlog, body.name));
            else
                res.status(500).send("Err: No data Set.");
        })
        
        // UPTADE CHATLOG       idChatlog* || nameChatlog*, idUser* , hasPassword , password , isVisible , name , description , color , effect , font , icon , 
        //                      colorMessages , effectMessages , fontMessages  
        app.patch('/Chatlog', jsonParser, (req,res) => {
            let body = req.body;
            if(body!=null)
                res.send( _chatlogService.changeChatlog(
                    body.idChatlog,
                    body.hasPassword,
                    body.password,
                    body.idUser,
                    body.isVisible,
                    body.name,
                    body.description,
                    pstClr(body.color),
                    body.effect,
                    body.font,
                    body.icon,
                    pstClr(body.colorMessages),
                    body.effectMessages,
                    body.fontMessages,
                    )
                )
            else 
                res.status(500).send("Err: No data Set.");
        })

        // DELETE CHATLOG       idChatlog* || nameChatlog*, idUser*
        app.delete('/Chatlog', jsonParser, (req,res) => {
            let body = req.body;
            if(body!=null)
                res.send(_chatlogService.deleteChatlog(body.idChatlog, body.idUser, body.name) );
            else 
                res.status(500).send("Err: No data Set.");
        })       

    }

};  

module.exports = Routes;