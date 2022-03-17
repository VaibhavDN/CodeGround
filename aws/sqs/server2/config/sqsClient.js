const { SQSClient } = require("@aws-sdk/client-sqs");

const REGION = "us-east-1";
const sqsClient = new SQSClient({
  region: REGION,
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
  endpoint: "http://localhost:4566"
});
module.exports = { sqsClient };
