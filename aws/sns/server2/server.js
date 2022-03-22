const express = require("express");
const cors = require("cors");
const { subscribe } = require("./subscriber");

const app = express();
app.use(cors());

const PORT = 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.text()); // Note we are not using json here

app.get("/subscribe", async (req, res, next) => {
  subscribe();
  res.json({ status: true });
});

app.post("/neworder", async (req, res, next) => {
  console.log(req.body);
  return res.json({ status: true });
});

app.listen(PORT, async () => {
  console.log(`Server running at port ${PORT}`);
});

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
