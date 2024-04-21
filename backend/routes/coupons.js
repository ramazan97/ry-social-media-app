const express = require("express");
const router = express.Router();
const Coupon = require("../models/couponModel");
const {
  postCoupon,
  getCoupon,
  getIdCoupon,
  getCodeCoupon,
  putCoupon,
  deleteCoupon,
} = require("../controllers/couponsController");

router.post("/", postCoupon);

// Tüm kuponları getirme (Read - All)
router.get("/", getCoupon);

// Belirli bir kuponu getirme (Read - Single by Coupon ID)
router.get("/:couponId", getIdCoupon);

// Belirli bir kuponu getirme (Read - Single by Coupon Code)
router.get("/code/:couponCode", getCodeCoupon);

// Kupon güncelleme (Update)
router.put("/:couponId", putCoupon);

// Kupon silme (Delete)
router.delete("/:couponId", deleteCoupon);

module.exports = router;
