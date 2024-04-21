const express = require("express");
require("dotenv").config();
const mainRoute = require("./routes/index");
const mongoose = require("mongoose");
const app = express();

app.use((req, res, next) => {
  next();
});

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Veritabanına Bağlandı");
    app.listen(process.env.PORT, () => {
      console.log("4000. port dinleniyor...");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api", mainRoute);
