var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const crypto = require("crypto");
const passport = require('passport');
const session = require('express-session');
require("dotenv").config();
const cors = require("cors");
require("dotenv").config();
require("./utils/database");

const { initWebSocket } = require('./utils/socket');


const http = require('http');
const server = http.createServer(app);


initWebSocket(server);

server.listen(process.env.SOCKET_PORT, () => {
    console.log('Server is running on http://localhost:5000');
});


var indexRouter = require("./routes/index");
var usersRouter = require("./routes");


//ChatManagement
var StartConversationRouter = require("./routes/StartConversation");
var SendMessageRouter = require("./routes/SendMessage");
var GetConversationsRouter = require("./routes/GetConversations");
var GetMessagesRouter = require("./routes/GetMessages");
var SendOfferRouter = require("./routes/SendOffer");



var app = express();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(session({
  secret: 'akshdkashdquooaksXCVBNLWIQ0EQWEKLMlmkjwnsdjasnd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

function validateAPIKey(req, res, next) {
  const authkey = req.header('api-key');
  if (authkey && crypto.createHash('sha256').update(authkey).digest('hex') == process.env.API_KEY) {
    next();
  } else {
    res.status(401).send(`
      <html>
        <head>
          <title>Unauthorized Access</title>
          <style>
            body {
              background-color: #f8f8f8;
              font-family: Arial, sans-serif;
              color: #333;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .container {
              text-align: center;
              padding: 20px;
              background-color: #fff;
              border: 1px solid #ddd;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
            }
            .container h1 {
              font-size: 24px;
              margin-bottom: 20px;
            }
            .container p {
              font-size: 16px;
              margin-bottom: 20px;
            }
            .container a {
              text-decoration: none;
              color: #007bff;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Unauthorized Access</h1>
            <p>You do not have permission to access this resource.</p>
            <p>Please contact the administrator if you believe this is an error.</p>
            <p><a href="/">Return to Home</a></p>
          </div>
        </body>
      </html>
    `);
  }
}

// app.use((req, res, next) => {
//   if (req.path.startsWith('/images')) {
//     return next();
//   }
//   validateAPIKey(req, res, next);
// });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("", usersRouter);

// CHAT MANAGEMENT
app.use("/api/v1/chat/startConversation", StartConversationRouter);
app.use("/api/v1/chat/sendMessage", SendMessageRouter);
app.use("/api/v1/chat/getConversations", GetConversationsRouter);
app.use("/api/v1/chat/getMessages", GetMessagesRouter);
app.use("/api/v1/chat/sendOffer", SendOfferRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});



module.exports = app;
