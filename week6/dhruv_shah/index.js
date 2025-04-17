const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Define the message schema
const messageSchema = new Schema({
  content: String,
  timestamp: { type: Date, default: Date.now }
});

const messageModel = mongoose.model("Message", messageSchema);

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Fetch stored messages
app.get('/messages', async (req, res) => {
  res.json(await messageModel.find());
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Load existing messages from MongoDB
  messageModel.find().then(messages => {
    socket.emit('load messages', messages);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('chat message', async (msg) => {
    const messageToSave = new messageModel({
        content: msg,
        timestamp: new Date()
    })

    await messageToSave.save().then(_ => {
        io.emit('chat message', msg);
    });;
    
  });
});  // <-- Closing brace for io.on('connection')


// Start server with MongoDB connection
server.listen(3000, async () => {
  await mongoose.connect("mongodb+srv://dhruvdb:luffy1zoro2nami3@cubstart-decal.ofxaygg.mongodb.net/?retryWrites=true&w=majority&appName=cubstart-decal");
  console.log('Listening on *:3000');
});
