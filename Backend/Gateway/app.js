const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto"); // Ensure the crypto module is imported
require("dotenv").config();

const app = express();
const proxy = require("express-http-proxy");

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log request details
app.use((req, res, next) => {
  console.log(`Gateway received request at ${new Date().toISOString()}: ${req.method} ${req.originalUrl}`);
  next();
});

// API Key validation middleware
function validateAPIKey(req, res, next) {
  const authkey = req.header("api-key");
  const hashedKey = crypto.createHash("sha256").update(authkey || "").digest("hex");

  if (hashedKey === process.env.API_KEY) {
    next(); // Proceed if the API key is valid
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

// Apply the API key validation middleware to all routes except /images
app.use((req, res, next) => {
  if (req.path.startsWith("/images")) {
    return next();
  }
  validateAPIKey(req, res, next);
});

// Service routes
const serviceRoutes = {
  "/api/v1/auth": process.env.AUTH_URI,
  "/api/v1/notification": process.env.NOTIFICATION_URI,
  "/api/v1/user": process.env.USER_MANAGEMENT_URI, 
  "/api/v1/job": process.env.JOB_MANAGEMENT_URI,
  "/api/v1/chat": process.env.CHAT_MANAGEMENT_URI,
};

// Set up proxy for each service route
Object.entries(serviceRoutes).forEach(([route, target]) => {
  app.use(
    route,
    proxy(target, {
      proxyReqPathResolver: (req) => `${route}${req.url}`, // Append the original request path and query params
    })
  );
});

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler for other errors
app.use((err, req, res, next) => {
  console.error("Gateway error:", err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
