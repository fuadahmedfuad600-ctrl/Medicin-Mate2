const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:3000/live');
ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: 'init', context: {} }));
});
ws.on('message', (data) => console.log('Msg:', data.toString()));
ws.on('error', (err) => console.log('Error:', err));
ws.on('close', () => console.log('Closed'));
