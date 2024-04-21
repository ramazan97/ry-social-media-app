// const ShopCartModel = require("../models/shopCartModel");
// const mongoose = require("mongoose");

// const amqp = require("amqplib");

// const RabbitMQConnectionString = "amqp://localhost:5672"; // RabbitMQ adresi ve bağlantı bilgileri

// const connectRabbitMQ = async () => {
//   try {
//     const connection = await amqp.connect(RabbitMQConnectionString);
//     const channel = await connection.createChannel();

//     return channel; // Oluşturulan kanalı döndür
//   } catch (error) {
//     console.error("RabbitMQ bağlantısında hata oluştu:", error);
//     throw error;
//   }
// };
// const postShop = async (req, res) => {
//   // const { resim, ucret, baslik, kilogram, aciklama } = req.body;
//   const { name, img, kilogram, price, description } = req.body;
//   let bosAlanlar = [];
//   if (!name) {
//     bosAlanlar.push("name");
//   }
//   if (bosAlanlar.length > 0) {
//     return res.status(400).json({ hata: "Alanlar bos geçilemez", bosAlanlar });
//   }
//   try {
//     const shopCart = await ShopCartModel.create({
//       name,
//       img,
//       kilogram,
//       price,
//       description,
//       // kullanici_id,
//     });

//     const channel = await connectRabbitMQ();
//     await channel.assertQueue("shopCartQueue");
//     channel.sendToQueue("shopCartQueue", Buffer.from(JSON.stringify(shopCart)));
//     // console.log(channel, "channel");
//     res.status(200).json(shopCart);
//   } catch (error) {
//     res.status(400).json({ hata: error.message });
//     console.log("shop işleminde post sırasında hata oluştu");
//   }
// };

const ShopCartModel = require("../models/shopCartModel");
const mongoose = require("mongoose");
const amqp = require("amqplib");

const RabbitMQConnectionString = "amqp://localhost:5672"; // RabbitMQ adresi ve bağlantı bilgileri
const queueName = "shopCartQueue";

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RabbitMQConnectionString);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);

    return channel; // Oluşturulan kanalı döndür
  } catch (error) {
    console.error("RabbitMQ bağlantısında hata oluştu:", error);
    throw error;
  }
};

const postShop = async (req, res) => {
  const { name, img, kilogram, price, description } = req.body;

  try {
    // ShopCartModel ile ürünü veritabanına kaydet
    const shopCart = await ShopCartModel.create({
      name,
      img,
      kilogram,
      price,
      description,
    });

    // RabbitMQ'ya göndermek için mesaj oluştur
    const message = {
      id: shopCart._id, // Örneğin, shopCart'ın ID'sini kullanabilirsiniz
      name: shopCart.name,
      img: shopCart.img,
      kilogram: shopCart.kilogram,
      price: shopCart.price,
      description: shopCart.description,
    };

    const channel = await connectRabbitMQ();
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));

    // Başarılı yanıtı gönder
    res.status(200).json(shopCart);
  } catch (error) {
    // Hata durumunda hata yanıtını gönder
    res.status(400).json({ hata: error.message });
    console.log("shop işleminde post sırasında hata oluştu");
  }
};

module.exports = {
  postShop,
};

const getShop = async (req, res) => {

  try {
    const shopCarts = await ShopCartModel.find().sort({ createdAt: -1 });
    res.status(200).json(shopCarts);
  } catch (error) {
    res.status(400).json({ hata: "shop işlemi sırasında hata oluştu" });
  }
};
const getIdShop = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ hata: "ID Geçersiz" });
    }

    const cart = await ShopCartModel.findById(id);
    if (!cart) {
      return res.status(404).json({ hata: "Cart Bulunamadı" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(400)
      .json({ hata: "shop işlemini idye göre getirme  sırasında hata oluştu" });
  }
};

const deleteShop = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ hata: "ID Geçersiz" });
    }

    const cart = await ShopCartModel.findOneAndDelete({ _id: id });
    if (!cart) {
      return res.status(404).json({ hata: "Cart Bulunamadı" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ hata: error.message });
    console.log("shop işlemi sırasında delete yaparken hata oluştu");
  }
};
const putShop = async (req, res) => {
  const { id } = req.params;
  
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ hata: "ID Geçersiz" });
    }

    const cart = await ShopCartModel.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    if (!cart) {
      return res.status(404).json({ hata: "Cart Bulunamadı" });
    }

    const message = {
      id: cart._id,
      name: cart.name,
      img: cart.img,
      kilogram: cart.kilogram,
      price: cart.price,
      description: cart.description,
    };

    const channel = await connectRabbitMQ();
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log(message, "message put");
    console.log(channel, "channe put");
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ hata: error.message });
    console.log("shop işlemi sırasında put yaparken hata oluştu");
  }
};
const getSearchShop = async (req, res) => {
  try {
    const productName = req.params.productName;
    const products = await ShopCartModel.find({
      name: { $regex: productName, $options: "i" },
    });

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Server error. ürün arama işlemi sırasında hata oluştu" });
  }
};

module.exports = {
  getShop,
  getIdShop,
  postShop,
  deleteShop,
  putShop,
  getSearchShop,
};
