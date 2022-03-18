const { PublishCommand } = require("@aws-sdk/client-sns");
const { uniqueId } = require("lodash");
const { snsClient } = require("./config/snsClient.js");
const crypto = require("crypto");

const run = async () => {
  const message = JSON.stringify({
    OrderId: uniqueId(),
    OrderType: "OT1",
  });

  /**
   * Deduplication checks for MessageDeduplicationId as an attribute of the queue message, 
   * and prevents duplicate messages from being both sent and received in the 5-minute deduplication 
   * interval following either action by checking the MessageDeduplicationId
   * 
   * Messages that belong to the same group are processed one by one, in a strict order relative to the group
   */
  let params = {
    Message: message,
    TopicArn: "arn:aws:sns:us-east-1:000000000000:orders.fifo",
    MessageGroupId: "orders",
    MessageDeduplicationId: crypto
      .createHash("sha256")
      .update(message)
      .digest("hex"),
  };

  try {
    const data = await snsClient.send(new PublishCommand(params));
    console.log("Success.", data);
    return data;
  } catch (err) {
    console.log("Error", err.stack);
  }
};

setInterval(run, 5000);

// awslocal sns create-topic --name orders.fifo --attributes FifoTopic=true
