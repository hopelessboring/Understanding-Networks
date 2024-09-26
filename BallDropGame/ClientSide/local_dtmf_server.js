const net = require('net');
const { exec } = require('child_process');

// Configuration for the remote server to forward data to
const REMOTE_SERVER_HOST = 'localhost';  // Replace with the remote server host
const REMOTE_SERVER_PORT = 4000;  // Replace with the remote server port

// Variable to store the remote server connection
let remoteClient;

// Function to connect to the remote server persistently
function connectToRemoteServer() {
    remoteClient = net.connect({ host: REMOTE_SERVER_HOST, port: REMOTE_SERVER_PORT }, () => {
        console.log(`Connected to remote server at ${REMOTE_SERVER_HOST}:${REMOTE_SERVER_PORT}`);
    });

    // Handle data received from the remote server (optional)
    remoteClient.on('data', (data) => {
        console.log(`Received from remote server: ${data.toString()}`);
    });

    // Handle connection errors and attempt to reconnect
    remoteClient.on('error', (err) => {
        console.error(`Error with remote server connection: ${err.message}`);
        console.log('Reconnecting to remote server in 5 seconds...');
        setTimeout(connectToRemoteServer, 5000);  // Attempt to reconnect after 5 seconds
    });

    // Handle connection closure and attempt to reconnect
    remoteClient.on('end', () => {
        console.log('Remote server connection closed. Reconnecting...');
        setTimeout(connectToRemoteServer, 5000);  // Attempt to reconnect after 5 seconds
    });
}

// Connect to the remote server persistently
connectToRemoteServer();

// Create a local server to receive DTMF data
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const dtmfDigit = data.toString();
    //console.log(`Received DTMF digit: ${dtmfDigit}`);
    console.log(`${dtmfDigit}`);
    // handleDtmfDigit(dtmfDigit);
    handleDtmfForGame(dtmfDigit);
  });

  socket.on('end', () => {
    //console.log('Connection closed');
  });
});

const PORT = 8080; // Must match the port used in ngrok
server.listen(PORT, () => {
  console.log(`Local DTMF server listening on port ${PORT}`);
});

function handleDtmfDigit(digit) {
  switch (digit) {
    case '1':
      exec('echo "DTMF 1 received"', (error, stdout) => {
        if (error) {
          console.error(`Execution error: ${error}`);
          return;
        }
        console.log(`Output: ${stdout}`);
      });
      break;
    // Add more cases as needed
    // default:
    //   console.log('Unknown DTMF digit');
  }
}

function handleDtmfForGame(digit) {
    switch (digit) {
        case '2':
            // remoteClient.write('w' + '\n');  // Send data through the persistent connection
            remoteClient.write('w');  // Send data through the persistent connection
            return;
        case '4':
            remoteClient.write('a');  // Send data through the persistent connection
            return;
        case '6':
            remoteClient.write('s');  // Send data through the persistent connection
            return;
        case '8':
            remoteClient.write('d');  // Send data through the persistent connection
            return;
        case '*':
            remoteClient.write('x');  // Send data through the persistent connection
            return;
        case '#':
            remoteClient.write('i');  // Send data through the persistent connection
            return;
        case '0':
            remoteClient.write('=phreaker');  // Send data through the persistent connection
            return;
        // default:
        //     console.log('Unknown DTMF digit');
    }
}
