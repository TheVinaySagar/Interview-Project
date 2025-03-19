import express from 'express';
import dotenv from 'dotenv';
import Configuration from './config/configuration.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware setup
app.use(express.json());
app.use(Configuration.Cors);

// Connect to MongoDB
Configuration.connectDB();

// Route integration
Configuration.configRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});


// import express from 'express';
// import dotenv from 'dotenv';
// import Configuration from './config/configuration.js';
// import awsServerlessExpress from 'aws-serverless-express';
// import { createServer } from 'http';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware setup
// app.use(express.json());
// app.use(Configuration.Cors);

// // Connect to MongoDB
// Configuration.connectDB();

// // Route integration
// Configuration.configRoutes(app);

// // Create an HTTP server for AWS Lambda
// const server = createServer(app);

// // Export handler for AWS Lambda
// export const handler = (event, context) => {
//   return awsServerlessExpress.proxy(server, event, context);
// };


// import express from "express";
// import dotenv from "dotenv";
// import Configuration from "./config/configuration.js";
// import serverlessExpress from "@vendia/serverless-express";

// dotenv.config();
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(Configuration.Cors);

// // Database Connection
// Configuration.connectDB();

// // Routes
// Configuration.configRoutes(app);

// // ✅ Lambda Handler Fix
// export const handler = serverlessExpress({ app });
