import Notification from "../models/Notification";

export const getAllNotifications = async () => {
  try {
    return await Notification.find();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getNotificationById = async (id: string) => {
  try {
    return await Notification.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const addNotification = async (args: {
  title: string;
  text: string;
  userId: string;
}) => {
  try {
    const notification = new Notification(
      args as {
        title: string;
        text: string;
        userId: string;
      }
    );
    return await notification.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateNotification = async (args: {
  id: string;
  title: string;
  text: string;
}) => {
  try {
    return await Notification.findByIdAndUpdate(
      args.id,
      { title: args.title, text: args.text },
      { new: true }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteNotification = async (id: string) => {
  try {
    return await Notification.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error.message);
  }
};
