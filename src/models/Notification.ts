// Import necessary modules
import mongoose, { Schema, Document } from "mongoose";

// Define the interface for User document
export interface INotification extends Document {
  title: string;
  text: string;
  userId: string;
}

// Create a schema for the User model
const notificationSchema: Schema<INotification> = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

// Create and export the User model
export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
