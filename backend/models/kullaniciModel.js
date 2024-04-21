const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Sema = mongoose.Schema;

const kullaniciSema = new Sema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    avatar: { type: String },
    status: {
      type: String,
      default: "Onay Bekliyor",
      enum: ["Onay Bekliyor", "Onaylandı", "Red Edildi"],
    },
  },
  { timestamps: true }
);

kullaniciSema.statics.signup = async function (username, email, password) {
  // validatin işlemlerinin burada yapacaz

  if (!email || !password || !username) {
    throw Error("Alanlar boş geçilemez");
  }
  // isEmail ile mail mi değil mi kontrol ediyoruz
  if (!validator.isEmail(email)) {
    throw Error("Email kurallara uygun değil");
  }
  // isStrongPassword ile password mi değil mi kontrol ediyoruz
  if (!validator.isStrongPassword(password)) {
    throw Error("Parola yeterince güçlü değil");
  }

  const kontrolKullanici = await this.findOne({ email });

  if (kontrolKullanici) {
    throw Error("Email zaten kullanılıyor");
  }

  //   parolayı güçlendirmek için anlamsız random karakterlere salt dedik
  const salt = await bcrypt.genSalt(10);
  //   hash olayı password+ salt = şifrelenöişş hash
  const sifrelenmisParola = await bcrypt.hash(password, salt);

  //   şifrelenmiş password ile emailli veritabanına kayot ettik
  const kullanici = await this.create({
    email,
    username,
    password: sifrelenmisParola,
  });

  return kullanici;
};

kullaniciSema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("Alanlar boş geçilemez");
  }

  const kullanici = await this.findOne({ email });

  if (!kullanici) {
    throw Error("Email bulunamadı");
  }

  const parolaKontrol = await bcrypt.compare(password, kullanici.password);

  if (!parolaKontrol) {
    throw Error("Hatalı password girdiniz");
  }

  return kullanici;
};

module.exports = mongoose.model("Kullanici", kullaniciSema);
