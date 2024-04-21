const express = require("express");
const router = express.Router();

const couponsRoute = require("./coupons");
const kullaniciRoute = require("./kullanici");
const messagesRoute = require("./messages");
const paymentRoute = require("./payment");
const shopCartRoute = require("./shop");

router.use("/shopcart", shopCartRoute);
router.use("/kullanici", kullaniciRoute);
router.use("/coupon", couponsRoute);
router.use("/messages", messagesRoute);
router.use("/payment", paymentRoute);

module.exports = router;
