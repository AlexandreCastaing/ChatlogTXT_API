const Routes = class{    

    constructor(_app, _chatlogService, _bodyParser){

        let jsonParser = _bodyParser.json();
        let urlencodedParser = _bodyParser.urlencoded({ extended: false });

        // SEND MESSAGE         iduser , isVisible , message , color , effect , font , pseudo , idChatlog
        _app.post('/Message', urlencodedParser, (req,res) => {
            let body = req.body;
            if(body == null) res.status(500).send("Err: No Data Set.");
            else res.send( _chatlogService.sendMessage(
                    body.idUser, body.isVisible, body.idChatlog, body.pseudo, body.message, body.color, body.effect, body.font )
        )
        })

        // GET MESSAGES         idChatlog
        _app.get('/Messages', urlencodedParser, (req,res) => {
            let idChatlog = req.body.idChatlog;
            if(idChatlog!=null)
                res.send(_chatlogService.readMessagesByIdChatlog(idChatlog));
            else
                res.send(_chatlogService.readMessages());
        })

        // GET MESSAGE         idMessage
        _app.get('/Message', urlencodedParser, (req,res) => {
            let idMessage = req.body.idMessage;
            if(req.body!=null && idMessage!=null)
                res.send(_chatlogService.readMessageById(idMessage));
            else
                res.status(500).send("Err: No idMessage Set.");
        })

        // UPDATE MESSAGE       idMessage , isVisible , message , color , effect , font
        _app.patch('/Message', urlencodedParser, (req,res) => {
            let body = req.body;
            res.send(_chatlogService.changeMessage(body.idMessage, body.isVisible, body.message, body.color, body.effect, body.font) );
        })

        // DELETE MESSAGE       idMessage
        _app.delete('/Message', urlencodedParser, (req,res) => {
            let id = req.body.id;
            res.send(_chatlogService.deleteMessage(id) );
        })
        
    }

};  

module.exports = Routes;