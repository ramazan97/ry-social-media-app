const express = require("express");
const router = express.Router();
const Messages = require("../models/messages");
const {
  postMessages,
  getMessages,
  getIdMessages,
  deleteMessages,
} = require("../controllers/messagesController");
router.post("/", postMessages);

// Tüm kuponları getirme (Read - All)
router.get("/", getMessages);

router.get("/:messageId", getIdMessages);

// Kupon silme (Delete)
router.delete("/:messageId", deleteMessages);

module.exports = router;
