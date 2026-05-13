import Notification from "../models/Notification.js";
import { refreshNotifications } from "../utils/notifications.js";

const listNotifications = async (req, res, next) => {
  try {
    const notifications = await refreshNotifications(req.user._id);
    res.json({ notifications });
  } catch (error) {
    next(error);
  }
};

const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }

    res.json({ notification });
  } catch (error) {
    next(error);
  }
};

export { listNotifications, markNotificationRead };

