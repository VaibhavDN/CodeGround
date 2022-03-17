const { SendMessageCommand } = require("@aws-sdk/client-sqs");
const { sqsClient } = require("./config/sqsClient.js");

const params = {
  DelaySeconds: 10,
  MessageAttributes: {
    OrderId: {
      DataType: "Number",
      StringValue: "1",
    },
    OrderType: {
      DataType: "String",
      StringValue: "OT1",
    },
  },
  MessageBody:
    "Order placed successfully",
  //   MessageDeduplicationId: "Orders",  // Required for FIFO queues
  //   MessageGroupId: "Group1",  // Required for FIFO queues
  QueueUrl: "http://localhost:4566/000000000000/orders"
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