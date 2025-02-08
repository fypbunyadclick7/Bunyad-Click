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
const { sequelize } = require('./models/association');

sequelize.sync({ alter: true }) // Use { force: true } to reset tables in development
    .then(() => console.log('Database synchronized'))
    .catch(err => console.error('Error synchronizing database:', err));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes");


//Job Management
var GetCategoriesRouter = require("./routes/GetCategories");
var PostJobRouter = require("./routes/PostJob");
var UpdateJobStatusRouter = require("./routes/UpdateJobStatus");
var GetJobsRouter = require("./routes/GetJobs");
var GetJobRouter = require("./routes/GetJob");
var AddBidRouter = require("./routes/AddBid");
var GetBidsRouter = require("./routes/GetBids");
var GetBidRouter = require("./routes/GetBid");
var GetSellerJobsRouter = require("./routes/GetSellerJobs");
var GetSellerJobRouter = require("./routes/GetSellerJob");
var GetFilteredSellerJobsRouter = require("./routes/GetFilteredSellerJobs");
var DeleteJobRouter = require("./routes/DeleteJob");
var GetCommissionRouter = require("./routes/GetCommission");
var GetJobsForOfferRouter = require("./routes/GetJobsForOffer");
var AddOfferRouter = require("./routes/AddOffer");
var GetOfferRouter = require("./routes/GetOffer");
var RejectOfferRouter = require("./routes/RejectOffer");
var CategoryRouter = require("./routes/Category");
var SubCategoryRouter = require("./routes/SubCategory");
var GetSellerProfileJobsRouter = require("./routes/GetSellerProfileJobs");
var GetBuyerProfileJobsRouter = require("./routes/GetBuyerProfileJobs");


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

//Job Management
app.use("/api/v1/job/getCategories", GetCategoriesRouter);
app.use("/api/v1/job/postJob", PostJobRouter);
app.use("/api/v1/job/updateJob", UpdateJobStatusRouter);
app.use("/api/v1/job/getJobs", GetJobsRouter);
app.use("/api/v1/job/getJob", GetJobRouter);
app.use("/api/v1/job/addBid", AddBidRouter);
app.use("/api/v1/job/getBids", GetBidsRouter);
app.use("/api/v1/job/getBid", GetBidRouter);
app.use("/api/v1/job/getSellerJobs", GetSellerJobsRouter);
app.use("/api/v1/job/getSellerJob", GetSellerJobRouter);
app.use("/api/v1/job/getFilteredSellerJobs", GetFilteredSellerJobsRouter);
app.use("/api/v1/job/deleteJob", DeleteJobRouter);
app.use("/api/v1/job/getCommission", GetCommissionRouter);
app.use("/api/v1/job/getJobsForOffer", GetJobsForOfferRouter);
app.use("/api/v1/job/addOffer", AddOfferRouter);
app.use("/api/v1/job/getOffer", GetOfferRouter);
app.use("/api/v1/job/rejectOffer", RejectOfferRouter);
app.use("/api/v1/job/admin/category", CategoryRouter);
app.use("/api/v1/job/admin/subCategory", SubCategoryRouter);
app.use("/api/v1/job/getSellerProfileJobs", GetSellerProfileJobsRouter);
app.use("/api/v1/job/getBuyerProfileJobs", GetBuyerProfileJobsRouter);

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
