const { PublishCommand } = require("@aws-sdk/client-sns");
const { uniqueId } = require("lodash");
const { snsClient } = require("./config/snsClient.js");
const crypto = require("crypto");

const run = async () => {
  const message = {
    OrderId: uniqueId(),
    OrderType: "OT1",
  };

  /**
   * Deduplication checks for MessageDeduplicationId as an attribute of the queue message, 
   * and prevents duplicate messages from being both sent and received in the 5-minute deduplication 
   * interval following either action by checking the MessageDeduplicationId
   * 
   * Messages that belong to the same group are processed one by one, in a strict order relative to the group
   */
  let params = {
    Message: JSON.stringify(message),
    TopicArn: "arn:aws:sns:us-east-1:000000000000:orders.fifo",
    MessageGroupId: "orders",
    MessageDeduplicationId: crypto
      .createHash("sha256")
      .update(JSON.stringify(message))
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

/**
 * awslocal sqs create-queue --queue-name DeadLetterQueue
 * awslocal sqs get-queue-attributes --queue-url http://localhost:4566/000000000000/DeadLetterQueue --attribute-names All

 * awslocal sns create-topic --name orders.fifo --attributes FifoTopic=true
 * awslocal sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:orders.fifo --protocol http --notification-endpoint http://ipAddress:8080/neworder
 *
 * Messages are moved into a dead-letter queue using a redrive policy. A redrive policy is a JSON object 
 * that refers to the ARN of the dead-letter queue. The deadLetterTargetArn attribute specifies the ARN. 
 * The ARN must point to an Amazon SQS queue in the same AWS account and Region as your Amazon SNS subscription.
 *
 * awslocal sns set-subscription-attributes --attribute-name RedrivePolicy --attribute-value "{\"deadLetterTargetArn\": \"arn:aws:sqs:us-east-1:000000000000:DeadLetterQueue\", \"maxReceiveCount\": \"1\"}" --subscription-arn arn:aws:sns:us-east-1:000000000000:orders.fifo:53ddc7ad-8310-4aa0-816b-3ffd7dabc168
 * awslocal sns get-subscription-attributes --subscription-arn arn:aws:sns:us-east-1:000000000000:orders.fifo:09b86376-9b55-44e9-b1b6-c8b32a0a84fd
 * docker network create -d bridge --subnet 192.168.0.0/24 --gateway 192.168.0.1 mynet
 * It is a good idea to configure a dead letter queue for a subscription
 **/
