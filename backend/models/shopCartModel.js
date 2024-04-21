// monggose içerisinde bulunan schema kullanıyoruz
const mongoose = require("mongoose");

const Sema = mongoose.Schema;

const ReviewSchema = new Sema(
  {
    text: {
      type: String,
      // required: true
    },
    rating: {
      type: Number,
      // required: true
    },
    kullanici: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kullanici",
      // required: true
    },
  },
  { timestamps: true }
);
const shopCartSema = new Sema(
  {
    name: { type: String, required: true },
    img: [{ type: String, required: true }],
    reviews: [ReviewSchema],
    colors: [{ type: String, required: true }],
    kilogram: [{ type: String, required: true }],
    price: [{ type: Number, required: true }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      // required: true,
    },
    description: { type: String, required: true },
  },
  { timestamps: true }
);
// ('Not',notSema) isim ve shema vermemiz lazım
module.exports = mongoose.model("ShopCart", shopCartSema);
