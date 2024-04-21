const express = require("express");

const router = express.Router();
const Kullanici = require("../models/kullaniciModel");
const jwt = require("jsonwebtoken");
const {
  loginKullanici,
  signupKullanici,
  deleteUsers,
  getIdUsers,
  getUsers,
  putStatusUsers,
  putUsers,
} = require("../controllers/kullaniciController");
const tokenOlustur = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "1h" });
};

router.post("/login", loginKullanici);
router.post("/signup", signupKullanici);

// bütün kullaniciları getir
router.get("/", getUsers);

//id ye göre kullanici silme işlemi
router.delete("/:id", deleteUsers);

//id ye göre kullanici güncellme işlemi
router.put("/:email", putUsers);

//id ye göre kulaniciları güncellme işlemi
router.get("/:id", getIdUsers);

router.put("/status/:id", putStatusUsers);

module.exports = router;
