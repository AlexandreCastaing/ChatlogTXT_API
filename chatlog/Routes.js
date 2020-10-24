const Routes = class{    

    constructor(app, _chatlogService, _bodyParser){
        
        // create application/json parser
        let jsonParser = _bodyParser.json()

        // SEND MESSAGE         iduser , isVisible , message , color , effect , font , pseudo , idChatlog
        app.post('/Message', jsonParser, (req,res) => {
            let body = req.body;
            if(body == null) res.status(500).send("Err: No Data Set.");
            else res.send( _chatlogService.sendMessage(
                    body.idUser, body.isVisible, body.idChatlog, body.pseudo, body.message, body.color, body.effect, body.font )
            )
        })

        // GET MESSAGES         idChatlog
        app.get('/Messages', jsonParser, (req,res) => {
            let idChatlog = req.body.idChatlog;
            if(idChatlog!=null)
                res.send(_chatlogService.readMessagesByIdChatlog(idChatlog));
            else
                res.send(_chatlogService.readMessages());
        })

        // GET MESSAGE         idMessage
        app.get('/Message', jsonParser, (req,res) => {
            let idMessage = req.body.idMessage;
            if(req.body!=null && idMessage!=null)
                res.send(_chatlogService.readMessageById(idMessage));
            else
                res.status(500).send("Err: No idMessage Set.");
        })

        // UPDATE MESSAGE       idMessage , isVisible , message , color , effect , font
        app.patch('/Message', jsonParser, (req,res) => {
            let body = req.body;
            res.send(_chatlogService.changeMessage(body.idMessage, body.isVisible, body.message, body.color, body.effect, body.font) );
        })

        // DELETE MESSAGE       idMessage
        app.delete('/Message', jsonParser, (req,res) => {
            let id = req.body.idMessage;
            res.send(_chatlogService.deleteMessage(id) );
        })
        
    }

};  

module.exports = Routes;