const Kullanici = require("../models/kullaniciModel");
const jwt = require("jsonwebtoken");

const tokenOlustur = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "1h" });
};

const loginKullanici = async (req, res) => {
  const { email, password } = req.body;

  try {
    const kullanici = await Kullanici.login(email, password);
    const token = tokenOlustur(kullanici._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res
      .status(400)
      .json({ hata: "kullaniciları login işlemi sırasında hata oluştu" });
  }
};

const signupKullanici = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const kullanici = await Kullanici.signup(username, email, password);
    const token = tokenOlustur(kullanici._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res
      .status(400)
      .json({ hata: "kullaniciları signup işlemi sırasında hata oluştu" });
  }
};



const getUsers= async (req, res) => {
  try {
    const kullanicilar = await Kullanici.find().sort({ createdAt: -1 });
    res.status(200).json(kullanicilar);
  } catch (error) {
    res
      .status(400)
      .json({ hata: "kullaniciları geirme işlemi sırasında hata oluştu" });
  }
}
const deleteUsers= async (req, res) => {
  try {
    const { id } = req.params;

    const kullanici = await Kullanici.findOneAndDelete({ _id: id });

    res.status(200).json(kullanici);
  } catch (error) {
    res.status(400).json({
      hata: "id ye göre kullanici silme işlemi sırasında hata oluştu",
    });
  }
}
const putUsers=async (req, res) => {
  try {
    const { id, email } = req.params;

    const kullanici = await Kullanici.findOneAndUpdate(
      { email: email },
      { ...req.body },
      { new: true }
    );

    res.status(200).json(kullanici);
  } catch (error) {
    res.status(400).json({
      hata: "id ye göre kullanici güncelleme işlemi sırasında hata oluştu",
    });
  }
}
const getIdUsers=async (req, res) => {
  try {
    const { id } = req.params;

    const kullanici = await Kullanici.findById(id);

    res.status(200).json(kullanici);
  } catch (error) {
    res.status(400).json({
      hata: "id ye göre kullanici getirme işlemi sırasında hata oluştu",
    });
  }
}
const putStatusUsers=async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const kullanici = await Kullanici.findByIdAndUpdate(
      { _id: id },
      { status },
      { new: true }
    );

    res.status(200).json(kullanici);
  } catch (error) {
    res.status(400).json({
      hata: "Kullanıcı durumu güncelleme sırasında hata oluştu",
    });
  }
}




module.exports = {
  loginKullanici,
  signupKullanici,
  getUsers,
  deleteUsers,
  putUsers,
  getIdUsers,
  putStatusUsers
};
