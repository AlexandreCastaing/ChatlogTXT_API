# Chatlog.Txt API

This is a simple Node.js chat server, the database is basically a txt file.

### Installing

You need to install Node.Js on the system where you want to run this project.
What things you need to install the chatlog and how to install them

```
npm install
```

### Config

The globals project values are stored on "./env"
We have env.dev  (developpement)
We have env.prod  (on production)

### Running

Next, run the server with this command.

```
npm run dev
```

(If you want to run on prod)

```
npm run prod
```

### Routes

POST    /Message     
body params:    iduser , isVisible , message , color , effect , font , pseudo , idChatlog

GET     /Messages
body params:    idChatlog

GET     /Message
body params:    idMessage

PATCH   /Message
body params:    idMessage , isVisible , message , color , effect , font

DELETE  /Message
body params:    idMessage


### More infos

See the Chatlog Doc.Pdf for more details.