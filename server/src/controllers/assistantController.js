import { askFinanceAssistant } from "../utils/assistant.js";

const chatWithAssistant = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400);
      throw new Error("Message is required");
    }

    const answer = await askFinanceAssistant(req.user._id, message);
    res.json(answer);
  } catch (error) {
    next(error);
  }
};

export { chatWithAssistant };

