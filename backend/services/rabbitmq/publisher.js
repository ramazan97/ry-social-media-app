
const amqp = require("amqplib");

const RabbitMQConnectionString = "amqp://localhost:5672"; // RabbitMQ adresi ve bağlantı bilgileri
const queueName = "shopCartQueue";

const connectRabbitMQ = async () => {

  try {
    const connection = await amqp.connect(RabbitMQConnectionString);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);


    channel.consume(queueName, (message) => {
      const content = JSON.parse(message.content.toString());



      
      console.log("Alınan mesaj:", content);

      console.log(message, "message");

      channel.ack(message);
    });

    console.log(channel, "channel");
    console.log("RabbitMQ yayıncısı başlatıldı.");
  } catch (error) {
    console.error("RabbitMQ bağlantısında hata oluştu:", error);
    throw error;
  }
};


connectRabbitMQ();
