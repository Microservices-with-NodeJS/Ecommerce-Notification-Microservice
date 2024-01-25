import express from "express";
const app = express();
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema";
import { subscribeToRabbitMQ } from "nodejs_ms_shared_library";

import * as NotificationService from "../src/services/notificationService";

dotenv.config();
app.use(morgan("common"));

// USE HELMET AND CORS MIDDLEWARES
app.use(
  cors({
    origin: ["*"], // Comma separated list of your urls to access your api. * means allow everything
    credentials: true, // Allow cookies to be sent with requests
  })
);
// app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);

app.use(express.json());

// DB CONNECTION

if (!process.env.MONGODB_URL) {
  throw new Error("MONGO_URI environment variable is not defined");
}

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB connected to the backend successfully");
  })
  .catch((err: Error) => console.log(err));

// RabbitMQ subscription for "ProductCreated" event
subscribeToRabbitMQ(
  "your_exchange",
  "ProductCreated",
  async (message) => {
    try {
      // Parse the incoming message
      const productCreatedEvent = JSON.parse(message.toString());

      // Handle the event in your NotificationService e.g send a notification to user that created
      // the product and tell him a new product was created under his account for transprency
      // You can destructure this event to pick up only information you need
      // key value pairs in the new notification
      await NotificationService.addNotification(productCreatedEvent);
    } catch (error) {
      console.error("Error processing ProductCreated event:", error);
    }
  },
  {
    host: process.env.RABBIT_MQ_HOST,
    port: Number(process.env.RABBIT_MQ_PORT),
    username: process.env.RABBIT_MQ_USERNAME,
    password: process.env.RABBIT_MQ_HOST,
  }
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

// Start backend server
const PORT = process.env.PORT || 8900;

// Check if it's not a test environment before starting the server

app.listen(PORT, () => {
  console.log(`Backend server is running at port ${PORT}`);
});

export default app;
