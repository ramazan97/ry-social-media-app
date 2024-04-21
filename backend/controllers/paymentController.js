


const postPayment=async (req, res) => {
    const { products, user, cargoFee } = req.body;
  console.log(req.body,"req.body")
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.amount,
    }));
  
    if (cargoFee !== 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Hızlı Kargo",
          },
          unit_amount: cargoFee * 100,
        },
        quantity: 1,
      });
    }
  
    try {
      const session = await stripe.checkout.sessions.create({
        customer_email: user.email,
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_DOMAIN}/success`,
      });
  
      res.status(200).json({ id: session.id });
    } catch (error) {
      res
        .status(400)
        .json({ hata: "kullaniciları signup işlemi sırasında hata oluştu" });
    }
  }


module.exports = {
    postPayment
  };
  