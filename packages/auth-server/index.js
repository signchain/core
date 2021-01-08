const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const socket = require('./services/socket-io');

const app = express()
app.use(cors())
dotenv.config()
const PORT = process.env.PORT || 3001;

const http = require('http').createServer(app);

const io = require('socket.io')(http,{
  cors: {
    origin: '*',
  }
});

console.log('GOING!!!')
socket(io)

http.listen('3001', ()=>{
  console.log("Listening on port:", PORT)
});
