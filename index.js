const express = require('express');
const app = express()
const WebSocket = require('ws');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var bodyParser = require('body-parser')
var session = require('express-session')
var cookieSession = require('cookie-session')

const routers = require('./routers');
const Game = require('./controller/game');
var Keygrip = require('keygrip')

app.set('trust proxy', 1) // trust first proxy

var session = cookieSession({
  name: 'session22',
  keys: new Keygrip(['key1', 'key2'], 'sha256', 'hex'),
  maxAge: 2400 * 60 * 60 * 10,
  cookie: {
    httpOnly: true,
    secure: true
  }
})

app.use(session)

// app.use(session({
//   resave: true,
//     saveUninitialized: true,
//     secret: 'admin9saoosdssss',
//     cookie: { maxAge: 24 * 60 * 60 * 1000 }
// }))
dotenv.config()
mongoose.connect(process.env.DB_CONNECT,{ },()=>console.log('Connected to db'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))
app.set("view engine","ejs")
app.set("views","./views")
routers(app)
Game.GameStart();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });
server.listen(2002,()=>console.log('Server Running on port 2002'));
