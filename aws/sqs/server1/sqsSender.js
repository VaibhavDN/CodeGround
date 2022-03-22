const { SendMessageCommand } = require("@aws-sdk/client-sqs");
const { sqsClient } = require("./config/sqsClient.js");
const crypto = require("crypto");

const message = {
  OrderId: {
    DataType: "Number",
    StringValue: "1",
  },
  OrderType: {
    DataType: "String",
    StringValue: "OT1",
  },
};

const params = {
  DelaySeconds: 10,
  MessageAttributes: message,
  MessageBody: "Order placed successfully",
  // MessageDeduplicationId: crypto
  //   .createHash("sha256")
  //   .update(JSON.stringify(message))
  //   .digest("hex"),
  // MessageGroupId: "orders",
  QueueUrl: "http://localhost:4566/000000000000/DeadLetterQueue",
};

const run = async () => {
  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    console.log("Success, message sent. MessageID:", data.MessageId);
  } catch (err) {
    console.log("Error", err);
  }
};
run();
