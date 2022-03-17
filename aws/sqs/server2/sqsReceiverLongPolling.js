const { ReceiveMessageCommand } = require("@aws-sdk/client-sqs");
const { sqsClient } = require("./config/sqsClient.js");

// Set the parameters
const queueURL = "http://localhost:4566/000000000000/orders"; // SQS_QUEUE_URL
const params = {
  AttributeNames: ["ALL"],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: ["All"],
  QueueUrl: queueURL,
  WaitTimeSeconds: 20,
};

const run = async () => {
  try {
    const data = await sqsClient.send(new ReceiveMessageCommand(params));
    console.log("Success, ", data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};
run();