const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

// Init Nexmo
const nexmo = new Nexmo({
  apiKey: '8d944f25',
  apiSecret: 'TJZMPtB3K3qKXh7u'
}, { debug: true });

// Init
const app = express();

// Template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public folder setup
app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// INdex route
app.get('/', (req, res) => {
  res.render('index');
});

// Post
app.post('/', (req, res) => {
  // res.send(req.body);
  // console.log(req.body);
  const number = req.body.number;
  const text = req.body.text;

  nexmo.message.sendSms(
    '5521995394396', number, text, { type: 'unicode' },
    (err, responseData) => {
      if(err) {
        console.log(err);
      } else {
        console.dir(responseData);
        // Get data from response
        const data = {
          id: responseData.messages[0]['message-id'],
          number: responseData.messages[0]['to']
        };

        io.emit('smsStatus', data);
      }
    }
  )
});

// Define port
const port = 3000;

// Start server
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// Connect socket io
const io = socketio(server);
io.on('connection', () => {
  console.log('Connected');
  io.on('disconect', () => {
    console.log('Disconected');
  });
});