const { SubscribeCommand } = require("@aws-sdk/client-sns");
const { snsClient } = require("./config/snsClient.js");
const os = require("os");

exports.subscribe = async () => {
    const networkInterfaces = os.networkInterfaces();
    const ipAddress = networkInterfaces['Wi-Fi'][1].address; // To use with localstack docker

    const params = {
        Protocol: "http",
        TopicArn: "arn:aws:sns:us-east-1:000000000000:orders.fifo",
        Endpoint: `http://${ipAddress}:8080/neworder`, // Use EC2 endpoint for the actual server
      };
  
    try {
    const data = await snsClient.send(new SubscribeCommand(params));
    console.log("Success.", data);
    return data;
  } catch (err) {
    console.log("Error", err.stack);
  }
};
