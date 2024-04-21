const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const { postPayment } = require("../controllers/paymentController");
const stripe = require("stripe")(process.env.REACT_APP_MY_STRIPE_SECRET_KEY);

router.post("/", postPayment);

module.exports = router;
