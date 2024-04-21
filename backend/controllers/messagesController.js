const Messages = require("../models/messages");

const postMessages = async (req, res) => {
  try {
    const { name, email, phone, messages } = req.body;

    const newMessages = new Messages(req.body);
    await newMessages.save();
    res.status(201).json(newMessages);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server error. message oluşturma işlemi sırasında hata oluştu",
    });
  }
};
const getMessages = async (req, res) => {
  try {
    const messages = await Messages.find();
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server error. kupon getirme işlemi sırasında hata oluştu",
    });
  }
};
const getIdMessages = async (req, res) => {
  try {
    const messageId = req.params.messageId;

    const message = await Messages.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Messages not found." });
    }

    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
};
const deleteMessages = async (req, res) => {
  try {
    const messageId = req.params.messageId;

    const deletedMessage = await Messages.findByIdAndRemove(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ error: "Messages not found." });
    }

    res.status(200).json(deletedMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = {
  postMessages,
  getMessages,
  getIdMessages,
  deleteMessages,
};
