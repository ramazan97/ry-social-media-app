const mongoose = require("mongoose");
const Sema = mongoose.Schema;
const messagesModel = new Sema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    messages: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Messages", messagesModel);
