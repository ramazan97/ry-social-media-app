const { model } = require("mongoose");
const ShopCartModel = require("../models/shopCartModel");
const mongoose = require("mongoose");
const {
  getShop,
  getIdShop,
  postShop,
  deleteShop,
  putShop,
  getSearchShop,
} = require("../controllers/shopController");
const express = require("express");

const router = express.Router();
// bütün ürünleri getirme
router.get("/", getShop);
//id ye göre ürün getirme işlemi
router.get("/:id", getIdShop);
//ürün oluşturma işlemi
router.post("/", postShop);
//id ye göre ürün silme işlemi
router.delete("/:id", deleteShop);
//id ye göre ürün güncellme işlemi
router.put("/:id", putShop);
//id ye göre ürün getirme işlemi
router.get("/search/:productName", getSearchShop);
module.exports = router;
