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
require("./utils/database");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes");

//User Management
var BecomeSellerRouter = require("./routes/BecomeSeller");
var UpdateProfileRouter1 = require("./routes/UpdateProfile");
var ChangeVisibilityRouter = require("./routes/ChangeVisibility");
var AddSkillRouter = require("./routes/AddSkill");
var DeleteSkillRouter = require("./routes/DeleteSkill");
var AddLanguageRouter = require("./routes/AddLanguage");
var UpdateLanguageRouter = require("./routes/UpdateLanguage");
var DeleteLanguageRouter = require("./routes/DeleteLanguage");
var AddEducationRouter = require("./routes/AddEducation");
var UpdateEducationRouter = require("./routes/UpdateEducation");
var DeleteEducationRouter = require("./routes/DeleteEducation");
var AddEmploymentHistoryRouter = require("./routes/AddEmploymentHistory");
var UpdateEmploymentHistoryRouter = require("./routes/UpdateEmploymentHistory");
var DeleteEmploymentHistoryRouter = require("./routes/DeleteEmploymentHistory");
var AddProjectRouter = require("./routes/AddProject");
var UpdateProjectRouter = require("./routes/UpdateProject");
var UpdateProjectStatusRouter = require("./routes/UpdateProjectStatus");
var DeleteProjectRouter = require("./routes/DeleteProject");
var GetProfileRouter1 = require("./routes/GetProfile");
var GetProfileWithJobsRouter1 = require("./routes/GetProfileWithJobs");
var GetBuyerProfileWithJobsRouter = require("./routes/GetBuyerProfileWithJobs");
var AddSellerProfileRouter = require("./routes/AddSellerProfile");


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

// User Management
app.use("/api/v1/user/becomeSeller", BecomeSellerRouter);
app.use("/api/v1/user/updateProfile", UpdateProfileRouter1);
app.use("/api/v1/user/changeVisibility", ChangeVisibilityRouter);
app.use("/api/v1/user/addSkill", AddSkillRouter);
app.use("/api/v1/user/deleteSkill", DeleteSkillRouter);
app.use("/api/v1/user/addLanguage", AddLanguageRouter);
app.use("/api/v1/user/updateLanguage", UpdateLanguageRouter);
app.use("/api/v1/user/deleteLanguage", DeleteLanguageRouter);
app.use("/api/v1/user/addEducation", AddEducationRouter);
app.use("/api/v1/user/updateEducation", UpdateEducationRouter);
app.use("/api/v1/user/deleteEducation", DeleteEducationRouter);
app.use("/api/v1/user/addEmploymentHistory", AddEmploymentHistoryRouter);
app.use("/api/v1/user/updateEmploymentHistory", UpdateEmploymentHistoryRouter);
app.use("/api/v1/user/deleteEmploymentHistory", DeleteEmploymentHistoryRouter);
app.use("/api/v1/user/addProject", AddProjectRouter);
app.use("/api/v1/user/updateProject", UpdateProjectRouter);
app.use("/api/v1/user/updateProjectStatus", UpdateProjectStatusRouter);
app.use("/api/v1/user/deleteProject", DeleteProjectRouter);
app.use("/api/v1/user/getProfile", GetProfileRouter1);
app.use("/api/v1/user/admin/getSellerProfile", GetProfileWithJobsRouter1);
app.use("/api/v1/user/admin/getBuyerProfile", GetBuyerProfileWithJobsRouter);
app.use("/api/v1/user/addSellerProfile", AddSellerProfileRouter);


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
