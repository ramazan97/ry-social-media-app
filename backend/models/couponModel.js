const mongoose = require("mongoose");
const Sema = mongoose.Schema;
const couponModel = new Sema(
  {
    code: { type: String, required: true }, // Kupon kodu
    discountPercent: { type: Number, required: true }, // İndirim oranı
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponModel);

