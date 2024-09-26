const express = require('express');
const bodyParser = require('body-parser');
const net = require('net');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

// Answer webhook
app.get('/webhooks/answer', (req, res) => {
    const ncco = [];
    ncco.push(
    {       
        action: 'talk',
        text: 'Please enter some digits homeboy.',    
    }
    );

    for (let i = 0; i < 50; i++) {
        ncco.push(    
            {
                action: 'input',
                submitOnHash: false, // Automatically submit each digit without requiring #
                eventUrl: ['http://206.81.9.216:3000/webhooks/dtmf'],  // Your actual domain
                eventMethod: 'POST',
                maxDigits: 1, // Only accept one digit at a time
                timeOut: 0, // Wait 1 seconds between digits
            }
        );
    }
    res.json(ncco);
});

// DTMF webhook
app.post('/webhooks/dtmf', (req, res) => {
    console.log('Request Body:', req.body);

    const dtmfDigit = req.body.dtmf?.digits || req.body.digits || req.body.dtmf;
    console.log(`Received DTMF digit: ${dtmfDigit}`);

    // Proceed only if dtmfDigit is defined
    if (dtmfDigit) {
        // Send each digit individually via ngrok
        const client = new net.Socket();
        const NGROK_HOST = '4.tcp.ngrok.io'; // Replace with your ngrok host
        const NGROK_PORT = 19356; // Replace with your ngrok port number

        client.connect(NGROK_PORT, NGROK_HOST, () => {
            console.log('Connected to local machine via ngrok tunnel');
            client.write(dtmfDigit); // Send each digit individually
            client.end();
        });

        client.on('error', (err) => {
            console.error('Error connecting to ngrok tunnel:', err.message);
        });
    } else {
        console.error('DTMF digit is undefined or not received');
    }

    // Send an empty response to keep the call open and continue listening for more digits
    res.json([]);
});

// Event webhook (optional)
app.post('/webhooks/event', (req, res) => {
    console.log('Event webhook received:', req.body);
    res.status(200).end();
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
});