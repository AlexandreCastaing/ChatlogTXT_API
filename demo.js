// todo mdp get
// todo return json of chatlog
// separe method return json & others 

let sendRequestUrl = (_url, _method, _data, _success)=>{

    if(_method != "GET"){
        var XHR = new XMLHttpRequest();
        /*
        var urlEncodedData = "";
        var urlEncodedDataPairs = [];
        var name;
        for(name in _data) {
        urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(_data[name]));
        }
        urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');*/
        XHR.addEventListener('load', function(res) {
            let resData = res.srcElement.response;
            _success(resData);
        });
        XHR.addEventListener('error', function(err) {
            console.log(err)
        });
        XHR.open(_method, _url);
        
        //XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        XHR.setRequestHeader('Content-Type', 'application/json');
        XHR.setRequestHeader('Access-Control-Allow-Origin', "*");
        
        XHR.send(JSON.stringify(_data));
    }
    else{
        //function ajax(file, params, callback) {

        let url = _url + '?';
        let params = _data;
        
        // loop through object and assemble the url
        var notFirst = false;
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
            url += (notFirst ? '&' : '') + key + "=" + params[key].replace('#', '');
            }
            notFirst = true;
        }
        
        // create a AJAX call with url as parameter
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                let resData = xmlhttp.responseText;
                _success(resData);
            }
        };
        xmlhttp.open('GET', url, true);
        console.log(url)
        xmlhttp.send();
        
    }

}

let sendRequest = (_route, _method, _data, _success)=>{
    sendRequestUrl("http://localhost:2299"+_route, _method, _data, _success)
}

let gId = (e)=>document.getElementById(e);
let display = gId('display');
let chatlog = {}
let message = {}
let btns = {}
let chatlogJson = {};
let messageJson = {};


let buttonPressed = (b, id)=>{   

    switch(id){
        case 'chatlog_GET_CHATLOGS' : b.onclick = ()=>GET_CHATLOGS() ;break;
        case 'chatlog_GET_CHATLOG' : b.onclick = ()=>GET_CHATLOG() ;break;
        case 'chatlog_POST_CHATLOG' : b.onclick = ()=>POST_CHATLOG() ;break;
        case 'chatlog_UPDATE_CHATLOG' : b.onclick = ()=>UPDATE_CHATLOG() ;break;
        case 'chatlog_DELETE_CHATLOG' : b.onclick = ()=>DELETE_CHATLOG() ;break;
        case 'message_GET_MESSAGES' : b.onclick = ()=>GET_MESSAGES() ;break;
        case 'message_GET_MESSAGE' : b.onclick = ()=>GET_MESSAGE() ;break;
        case 'message_POST_MESSAGE' : b.onclick = ()=>POST_MESSAGE() ;break;
        case 'message_UPDATE_MESSAGE' : b.onclick = ()=>UPDATE_MESSAGE() ;break;
        case 'message_DELETE_MESSAGE' : b.onclick = ()=>DELETE_MESSAGE() ;break;
    }

}

let initPress_ = (b,id)=>{
    b.setAttribute("ident", id);
    buttonPressed(b,id);
}

initPress_(btns.chatlog_GET_CHATLOGS = gId("chatlog_GET_CHATLOGS"),"chatlog_GET_CHATLOGS")
initPress_(btns.chatlog_GET_CHATLOG = gId("chatlog_GET_CHATLOG"),"chatlog_GET_CHATLOG")
initPress_(btns.chatlog_POST_CHATLOG = gId("chatlog_POST_CHATLOG"),"chatlog_POST_CHATLOG")
initPress_(btns.chatlog_UPDATE_CHATLOG = gId("chatlog_UPDATE_CHATLOG"),"chatlog_UPDATE_CHATLOG")
initPress_(btns.chatlog_DELETE_CHATLOG = gId("chatlog_DELETE_CHATLOG"),"chatlog_DELETE_CHATLOG")
initPress_(btns.message_GET_MESSAGES = gId("message_GET_MESSAGES"),"message_GET_MESSAGES")
initPress_(btns.message_GET_MESSAGE = gId("message_GET_MESSAGE"),"message_GET_MESSAGE")
initPress_(btns.message_POST_MESSAGE = gId("message_POST_MESSAGE"),"message_POST_MESSAGE")
initPress_(btns.message_UPDATE_MESSAGE = gId("message_UPDATE_MESSAGE"),"message_UPDATE_MESSAGE")
initPress_(btns.message_DELETE_MESSAGE = gId("message_DELETE_MESSAGE"),"message_DELETE_MESSAGE")


let refresh_All_HTML_INPUTDATA = ()=>{
    chatlog.idChatlog = gId("chatlog_idChatlog").value;
    chatlog.hasPassword = gId("chatlog_hasPassword").checked;
    chatlog.password = gId("chatlog_password").value;
    chatlog.idUser = gId("chatlog_idUser").value;
    chatlog.isVisible = gId("chatlog_isVisible").checked;
    chatlog.name = gId("chatlog_name").value;
    chatlog.description = gId("chatlog_description").value;
    chatlog.color  = gId("chatlog_color").value.replace('#', '');
    chatlog.effect  = gId("chatlog_effect").value;
    chatlog.font  = gId("chatlog_font").value;
    chatlog.icon  = gId("chatlog_icon").value;
    chatlog.colorMessages  = gId("chatlog_colorMessages").value.replace('#', '');
    chatlog.effectMessages  = gId("chatlog_effectMessages").value;
    chatlog.fontMessages  = gId("chatlog_fontMessages").value;
    
    message.idUser = gId("message_idUser").value;
    message.idMessage = gId("message_idMessage").value;
    message.idChatlog = gId("message_idChatlog").value;
    message.nameChatlog = gId("message_nameChatlog").value;
    message.password = gId("message_password").value;
    message.isVisible = gId("message_isVisible").checked;
    message.pseudo = gId("message_pseudo").value;
    message.message = gId("message_message").value;
    message.color = gId("message_color").value.replace('#', '');
    message.effect = gId("message_effect").value;
    message.font = gId("message_font").value;

    chatlogJson = {};
    if(chatlog.idChatlog.length>0) chatlogJson.idChatlog = chatlog.idChatlog 
     chatlogJson.hasPassword = '' + chatlog.hasPassword
    if(chatlog.password.length>0) chatlogJson.password = chatlog.password 
    if(chatlog.idUser.length>0) chatlogJson.idUser = chatlog.idUser
     chatlogJson.isVisible = '' + chatlog.isVisible 
    if(chatlog.name.length>0) chatlogJson.name  = chatlog.name
    if(chatlog.description.length>0) chatlogJson.description = chatlog.description 
    if(chatlog.color.length>0) chatlogJson.color = chatlog.color
    if(chatlog.effect.length>0) chatlogJson.effect = chatlog.effect  
    if(chatlog.font.length>0) chatlogJson.font = chatlog.font 
    if(chatlog.icon.length>0) chatlogJson.icon = chatlog.icon                     
    if(chatlog.colorMessages.length>0) chatlogJson.colorMessages = chatlog.colorMessages 
    if(chatlog.effectMessages.length>0) chatlogJson.effectMessages = chatlog.effectMessages
    if(chatlog.fontMessages.length>0) chatlogJson.fontMessages = chatlog.fontMessages

    messageJson = {};
    if(message.idUser.length>0) messageJson.idUser = message.idUser
    if(message.idMessage.length>0) messageJson.idMessage = message.idMessage
    if(message.idChatlog.length>0) messageJson.idChatlog = message.idChatlog
     messageJson.isVisible = '' + message.isVisible
    if(message.message.length>0) messageJson.message = message.message
    if(message.color.length>0) messageJson.color =  message.color
    if(message.effect.length>0) messageJson.effect = message.effect
    if(message.font.length>0) messageJson.font = message.font
    if(message.pseudo.length>0) messageJson.pseudo = message.pseudo
    if(message.password.length>0) messageJson.password = message.password
    if(message.nameChatlog.length>0) messageJson.nameChatlog = message.nameChatlog

    console.log(chatlog)
    console.log(message)

}
refresh_All_HTML_INPUTDATA();

let log = (v)=>{
    try{
        let json = JSON.stringify(JSON.parse(v),null,2);
        console.log(json)
        display.innerHTML = json
    }catch(e){
        console.log(v)
        display.innerHTML = v
    }; 
};


// ROUTES 

let GET_CHATLOGS = ()=>{
    refresh_All_HTML_INPUTDATA();
    display.value=sendRequest('/Chatlogs', 'GET', chatlogJson, v=>log(v))
};
let GET_CHATLOG = ()=>{
    refresh_All_HTML_INPUTDATA();
    display.value=sendRequest('/Chatlog', 'GET', chatlogJson, v=>log(v))
};
let POST_CHATLOG = ()=>{
    refresh_All_HTML_INPUTDATA();
    display.value=sendRequest('/Chatlog', 'POST', chatlogJson, v=>log(v))
};
let UPDATE_CHATLOG = ()=>{
    refresh_All_HTML_INPUTDATA();
    display.value=sendRequest('/Chatlog', 'PATCH', chatlogJson, v=>log(v))
};
let DELETE_CHATLOG = ()=>{
    refresh_All_HTML_INPUTDATA();
    display.value=sendRequest('/Chatlog', 'DELETE', chatlogJson, v=>log(v))
};

let GET_MESSAGES = ()=>{
    refresh_All_HTML_INPUTDATA();
    display.value=sendRequest('/Messages', 'GET', messageJson, v=>log(v))
};
let GET_MESSAGE = ()=>{
    refresh_All_HTML_INPUTDATA();
    display.value=sendRequest('/Message', 'GET', messageJson, v=>log(v))
};
let POST_MESSAGE = ()=>{
    refresh_All_HTML_INPUTDATA();
    display.value=sendRequest('/Message', 'POST', messageJson, v=>log(v))
};
let UPDATE_MESSAGE = ()=>{
    refresh_All_HTML_INPUTDATA();
    display.value=sendRequest('/Message', 'PATCH', messageJson, v=>log(v))
};
let DELETE_MESSAGE = ()=>{
    refresh_All_HTML_INPUTDATA();
    display.value=sendRequest('/Message', 'DELETE', messageJson, v=>log(v))
};

gId("message_idUser").addEventListener('input', e => { gId("chatlog_idUser").value = gId("message_idUser").value });
gId("chatlog_idUser").addEventListener('input', e => { gId("message_idUser").value = gId("chatlog_idUser").value });

