const net = require('net');
const { exec } = require('child_process');

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const dtmfDigit = data.toString();
    console.log(`${dtmfDigit}`);
  });

  socket.on('end', () => {
    console.log('Connection closed');
  });
});

const PORT = 4000; // Must match the port used in ngrok
server.listen(PORT, () => {
  console.log(`Local mock remote server listening on port ${PORT}`);
});