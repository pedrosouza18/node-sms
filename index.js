const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');
const http = require('http');
const debug = require("debug")("node");

// Init Nexmo
const nexmo = new Nexmo({
  apiKey: '8d944f25',
  apiSecret: 'TJZMPtB3K3qKXh7u'
}, { debug: true });

// Init
const app = express();

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// Template engine setup
// app.set('view engine', 'html');
// app.engine('html', ejs.renderFile);

// // Public folder setup
// app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// INdex route
app.get('/', (req, res) => {
  res.render('index');
});

// Post
app.post('/send-sms', (req, res) => {
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

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

// Define port
// const port = 3000;

// // Start server
// const server = app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

// Connect socket io
const io = socketio(server);
io.on('connection', () => {
  console.log('Connected');
  io.on('disconect', () => {
    console.log('Disconected');
  });
});