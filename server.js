// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));
const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', async (msg) => {
    // Forward user message to Python server
    try {
      const response = await axios.post('http://localhost:5001/bot', { message: msg });
      const botReply = response.data.bot_reply;

      // Send bot reply to all connected clients
      io.emit('chat message', `Bot: ${botReply}`);
    } catch (error) {
      console.error('Error communicating with the Python server:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
