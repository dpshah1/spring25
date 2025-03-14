const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Store messages in memory (in a real app, you'd use a database)
const messages = new Map();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    
    // Send existing messages to newly connected users
    const existingMessages = Array.from(messages.values());
    socket.emit('load messages', existingMessages);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        const messageData = {
            id: Date.now().toString(), // unique ID for the message
            text: msg,
            senderId: socket.id,
            timestamp: new Date().toISOString(),
            reactions: {},
            edited: false
        };
        
        messages.set(messageData.id, messageData);
        io.emit('chat message', messageData);
    });

    socket.on('edit message', (data) => {
        const message = messages.get(data.messageId);
        if (message && message.senderId === socket.id) {
            message.text = data.newText;
            message.edited = true;
            messages.set(data.messageId, message);
            io.emit('message edited', message);
        }
    });

    socket.on('delete message', (messageId) => {
        const message = messages.get(messageId);
        if (message && message.senderId === socket.id) {
            messages.delete(messageId);
            io.emit('message deleted', messageId);
        }
    });

    socket.on('add reaction', (data) => {
        const message = messages.get(data.messageId);
        if (message && message.senderId !== socket.id) {
            if (!message.reactions[data.emoji]) {
                message.reactions[data.emoji] = new Set();
            }
            message.reactions[data.emoji].add(socket.id);
            messages.set(data.messageId, message);
            
            // Convert Set to Array for transmission
            const reactionsToSend = {};
            for (const [emoji, users] of Object.entries(message.reactions)) {
                reactionsToSend[emoji] = Array.from(users);
            }
            
            io.emit('reaction updated', {
                messageId: data.messageId,
                reactions: reactionsToSend
            });
        }
    });

    socket.on('remove reaction', (data) => {
        const message = messages.get(data.messageId);
        if (message && message.senderId !== socket.id && message.reactions[data.emoji]) {
            message.reactions[data.emoji].delete(socket.id);
            if (message.reactions[data.emoji].size === 0) {
                delete message.reactions[data.emoji];
            }
            messages.set(data.messageId, message);
            
            // Convert Set to Array for transmission
            const reactionsToSend = {};
            for (const [emoji, users] of Object.entries(message.reactions)) {
                reactionsToSend[emoji] = Array.from(users);
            }
            
            io.emit('reaction updated', {
                messageId: data.messageId,
                reactions: reactionsToSend
            });
        }
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});