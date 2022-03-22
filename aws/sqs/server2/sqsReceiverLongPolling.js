const {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");
const { sqsClient } = require("./config/sqsClient.js");

// Set the parameters
const queueURL = "http://localhost:4566/000000000000/DeadLetterQueue"; // SQS_QUEUE_URL
const params = {
  AttributeNames: ["ALL"],
  MaxNumberOfMessages: 10,
  MessageAttributeNames: ["All"],
  QueueUrl: queueURL,
  WaitTimeSeconds: 20,
};

const run = async () => {
  try {
    const data = await sqsClient.send(new ReceiveMessageCommand(params));
    console.log("Success, ", JSON.stringify(data));

    if (data.Messages) {
      const deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: data.Messages[0].ReceiptHandle,
      };

      try {
        const deleteResult = await sqsClient.send(
          new DeleteMessageCommand(deleteParams)
        );
        console.log("Message deleted", deleteResult);
      } catch (err) {
        console.log("Error", err);
      }
    } else {
      console.log("No messages to delete");
    }
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};
run();
